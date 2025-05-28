import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const filesStarAll = await db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.isStarred, true)));
    // Convert BigInts to strings
    console.log(filesStarAll);
    const filesStar = filesStarAll.map((file: Record<string, unknown>) =>
      Object.fromEntries(
        Object.entries(file).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value,
        ])
      )
    );
    return NextResponse.json(filesStar);
  } catch (err) {
    console.error("Error creating folder:", err);
    return NextResponse.json(
      { error: "Failed to feaching star files or folder" },
      { status: 500 }
    );
  }
}
