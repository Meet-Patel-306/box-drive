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
    const folderId = searchParams.get("folderId") || "";
    console.log(queryUserId, userId, queryUserId === userId);
    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [folder] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, folderId), eq(files.userId, userId)));

    if (!folder) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (err) {}
}
