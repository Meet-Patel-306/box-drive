import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
    const parentId = searchParams.get("parentId");
    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    //feach from a spacific filder
    let userFiles;
    if (parentId) {
      // feach folder or file with same parentId
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.parentId, parentId)));
    }
    // not parentId mean files at root directory
    else {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), isNull(files.parentId)));
    }
    return NextResponse.json(userFiles);
  } catch (err) {
    console.error("Error creating folder:", err);
    return NextResponse.json(
      { error: "Failed to feaching files or folder" },
      { status: 500 }
    );
  }
}
