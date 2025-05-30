import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type FileNode = {
  id: string;
  name: string;
  size: number;
  path: string;
  type: string;
  url: string;
  thumbnailUrl: string | null;
  userId: string;
  parentId: string | null;
  isStarred: boolean;
  isTrash: boolean;
  isFolder: boolean;
};

type FolderNode = {
  id: string;
  name: string;
  isFolder: true;
  userId: string;
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
    id: folder.id,
    name: folder.name,
    isFolder: true,
    userId: folder.userId,
    files: fileList.map((f) => ({
      name: f.name,
      url: f.fileUrl, // assuming `fileUrl` is stored
      id: f.id,
      size: f.size,
      path: f.path,
      thumbnailUrl: f.thumbnailUrl || null,
      parentId: f.parentId || null,
      isFolder: f.isFolder,
      isStarred: f.isStarred,
      isTrash: f.isTrash,
      userId: f.userId,
      type: f.type,
    })),
    subfolders,
  };
}
