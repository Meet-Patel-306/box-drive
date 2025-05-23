import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, userId: bodyUserId, parentId = null } = body;
    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Folder Name required" },
        { status: 400 }
      );
    }
    //  Check if parent folder exists if parentId is provided
    if (parentId) {
      // parentId == files.id --> parentId must be exist
      // files.isFolder == true --> parentId must be folder
      // files.userId == userId --> user own that folder
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
      }
    }
    // create folder in database
    // we don't save folder in imageKit but we save data about folder in neon db
    // that help us to access file and folder structure
    // we give same define path for each folder
    const folderData = {
      name: name.trim(),
      size: 0,
      path: `/box-drive-folder/${userId}/${uuid4()}`,
      type: "folder",
      // folder not storage in imagekit so fileUrl not get
      fileUrl: "",
      thumbnailUrl: null,
      userId: userId!,
      parentId: parentId,
      isFolder: true,
    };
    const [newFolder] = await db.insert(files).values(folderData).returning();
    return NextResponse.json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (err) {
    console.error("Error creating folder:", err);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
