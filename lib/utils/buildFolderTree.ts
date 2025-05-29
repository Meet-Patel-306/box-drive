// helpers/buildFolderTree.ts
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type FileNode = {
  name: string;
  url: string;
};

type FolderNode = {
  folderName: string;
  files: FileNode[];
  subfolders: FolderNode[];
};

export async function buildFolderTree(
  folderId: string,
  userId: string
): Promise<FolderNode | null> {
  // Get current folder
  const [folder] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, folderId), eq(files.userId, userId)));

  if (!folder) return null;

  // Get all files (not folders) in this folder
  const fileList = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.parentId, folderId),
        eq(files.userId, userId),
        eq(files.isFolder, false),
        eq(files.isTrash, false)
      )
    );

  // Get all subfolders
  const folderList = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.parentId, folderId),
        eq(files.userId, userId),
        eq(files.isFolder, true),
        eq(files.isTrash, false)
      )
    );

  // Recurse for each subfolder
  const subfolderPromises = await Promise.all(
    folderList.map((subfolder) => buildFolderTree(subfolder.id, userId))
  );
  // Use a type guard to ensure only non-null values remain
  const subfolders: FolderNode[] = subfolderPromises.filter(
    (f): f is FolderNode => f !== null
  );

  return {
    folderName: folder.name,
    files: fileList.map((f) => ({
      name: f.name,
      url: f.fileUrl, // assuming `fileUrl` is stored
    })),
    subfolders,
  };
}
