import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  req: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await the params promise
    const params = await context.params;
    const { id } = params;

    const bookmark = await db.bookmark.findFirst({
      where: { authorId: session.user.id },
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, message: "No bookmark found" },
        { status: 404 }
      );
    }

    const updatedSnippets = bookmark.snippetIds.filter(
      (snippetId) => snippetId !== id
    );

    await db.bookmark.update({
      where: { id: bookmark.id },
      data: {
        snippetIds: { set: updatedSnippets },
      },
    });

    return NextResponse.json(
      { success: true, message: "Bookmark removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}