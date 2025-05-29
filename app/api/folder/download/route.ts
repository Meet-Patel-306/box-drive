import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { buildFolderTree } from "@/lib/utils/buildFolderTree";

//feach file and folder
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // www.xyz.com?userId=abc123&parentId=987654
    const searchParams = req.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const folderId = searchParams.get("folderId") || "";
    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const folderTree = await buildFolderTree(folderId, userId);
    if (!folderTree) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json(folderTree);
  } catch (err) {
    console.error("Error fetching folder files:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
