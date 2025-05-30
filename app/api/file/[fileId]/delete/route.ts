import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { buildFolderTree } from "@/lib/utils/buildFolderTree";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

// interface FileData {
//   id: string;
//   name: string;
//   size: number;
//   path: string;
//   type: string;
//   url: string;
//   thumbnailUrl: string | null;
//   userId: string;
//   parentId: string | null;
//   isStarred: boolean;
//   isTrash: boolean;
//   isFolder: boolean;
// }

type FileOrFolderNode = {
  id: string;
  isFolder: boolean;
  userId: string;
  imageKitId?: string;
};
async function deleteFileOrFolder(
  node: FileOrFolderNode,
  userId: string
): Promise<void> {
  if (!node.isFolder) {
    try {
      if (node.imageKitId) await imagekit.deleteFile(node.imageKitId);
      await db
        .delete(files)
        .where(and(eq(files.userId, userId), eq(files.id, node.id)));
      return;
    } catch (err) {
      throw new Error("File delete failed");
    }
  }

  const tree = await buildFolderTree(node.id, userId);
  if (!tree) throw new Error("Folder walk failed");
  try {
    await Promise.all([
      ...tree.files.map((f) => deleteFileOrFolder(f, userId)),
      ...tree.subfolders.map((sf) => deleteFileOrFolder(sf, userId)),
    ]);

    await db
      .delete(files)
      .where(and(eq(files.userId, userId), eq(files.id, node.id)));
  } catch (err) {
    throw new Error("Folder delete failed");
  }
}
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { fileId } = await props.params;
    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    await deleteFileOrFolder(file, userId);
    return NextResponse.json({ deleted: true });
    // if (!file.isFolder) {
    //   let fileImageKitId;
    //   if (file.fileUrl) {
    //     fileImageKitId = file.fileUrl.split(".")[0].split("/").pop();
    //   }
    //   if (fileImageKitId) {
    //     await imagekit.deleteFile(fileImageKitId);
    //     const deleteFile = await db
    //       .delete(files)
    //       .where(and(eq(files.userId, userId), eq(files.id, fileId)))
    //       .returning();
    //     return NextResponse.json(deleteFile);
    //   }
    // }
  } catch (err) {
    console.error("Error creating folder:", err);
    return NextResponse.json(
      { error: "Failed to update files or folder" },
      { status: 500 }
    );
  }
}
