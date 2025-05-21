import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// 1st upload using other way after save imageKit meta data in neon db and file data also
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { imagekit, userId: bodyUserId } = body;
    console.log(body);
    console.log("imagekit := ", body.imagekit);
    //login user id and frontend user id is diffrent
    // that mean person not login but it use diffrent person user id or random user id use
    // if person login than login userId === body frontend userId
    if (userId !== bodyUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!imagekit || !imagekit.url) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const fileData = {
      name: imagekit.name,
      size: imagekit.size || 0,
      path: imagekit.filePath,
      type: imagekit.type || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId!,
      //root level by defalut
      parentId: null,
    };
    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (err) {
    console.error("Error saving file:", err);
    return NextResponse.json(
      { error: "Failed to save file information" },
      { status: 500 }
    );
  }
}
