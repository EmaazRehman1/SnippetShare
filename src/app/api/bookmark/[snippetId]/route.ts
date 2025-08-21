import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth"; // if you’re using NextAuth

// DELETE /api/bookmark/:snippetId
export async function DELETE(
  req: Request,
  { params }: { params: { snippetId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { snippetId } = params;

    // Get the user's bookmark document
    const bookmark = await db.bookmark.findFirst({
      where: { authorId: session.user.id },
    });

    if (!bookmark) {
      return NextResponse.json(
        { success: false, message: "No bookmark found" },
        { status: 404 }
      );
    }

    // Remove the snippetId from array
    const updatedSnippets = bookmark.snippetIds.filter((id) => id !== snippetId);

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
