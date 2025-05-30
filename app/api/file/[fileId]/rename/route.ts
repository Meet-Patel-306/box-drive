import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "File new name is required" },
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
    const [updateFile] = await db
      .update(files)
      .set({ name: name })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();
    // //console.log(updateFile);
    return NextResponse.json(updateFile);
  } catch (err) {}
}
