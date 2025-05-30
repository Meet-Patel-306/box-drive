import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { v4 as uuid4 } from "uuid";

async function updateFolderSizeRecursively(
  folderId: string,
  sizeToAdd: number,
  userId: string
) {
  let currentFolderId = folderId || null;

  while (currentFolderId) {
    const [folder] = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.id, currentFolderId),
          eq(files.userId, userId),
          eq(files.isFolder, true)
        )
      );

    if (!folder) break;

    const newSize = (folder.size || 0) + sizeToAdd;

    await db
      .update(files)
      .set({ size: newSize })
      .where(eq(files.id, currentFolderId));

    currentFolderId = folder.parentId; // move up the chain
  }
}

// upload file or image in imageKit after save file metadata in neon db

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;
    const file = formData.get("file") as File;
    let fileName = file.name.split(".")[0];
    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!file) {
      return NextResponse.json(
        { error: "Upload file or image" },
        { status: 400 }
      );
    }
    //console.log("file == ", file);
    //console.log("form data==", formData);
    //check parent exist and user own that
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.userId, userId),
            eq(files.id, parentId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Folder not exist." },
          { status: 400 }
        );
      }
    }
    //only allow image or file upload
    // which mean if upload data is not pdf and not image than error give
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only image files are supported" },
        { status: 400 }
      );
    }
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const originalName = file.name;
    // hello.jpg -> [hello,jpg] == last element pop -> jpg
    const fileExtension = originalName.split(".").pop() || "";
    const uniqeName = `${uuid4()}.${fileExtension}`;
    const folderPath = parentId
      ? `/box-drive/${userId}/folder/${parentId}`
      : `/box-drive/${userId}`;

    let count = 1;
    while (true) {
      let fullname = fileName + "." + fileExtension;
      const sameNameFile = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.name, fullname)));
      if (!sameNameFile.length) {
        console.log(count, sameNameFile);
        break;
      }
      count =
        Number(
          sameNameFile[sameNameFile.length - 1].name.split(".")[0].split("(")[0]
        ) + 1 || count;
      console.log(count, sameNameFile);
      fileName = file.name.split(".")[0] + "(" + count + ")";
      count++;
    }
    const uploadFile = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqeName,
      folder: folderPath,
      useUniqueFileName: false,
    });
    const newFileData = {
      name: fileName + "." + fileExtension,
      size: file.size,
      path: folderPath,
      type: file.type,
      fileUrl: uploadFile.url,
      thumbnailUrl: uploadFile.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
    };
    const [newFile] = await db.insert(files).values(newFileData).returning();
    if (parentId) {
      await updateFolderSizeRecursively(parentId, newFile.size, userId);
    }
    return NextResponse.json(newFile);
  } catch (err) {
    console.error("Error saving file:", err);
    return NextResponse.json(
      { error: "Failed to save file information" },
      { status: 500 }
    );
  }
}
