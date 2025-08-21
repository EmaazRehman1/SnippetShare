import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { authorId, snippetIds } = body;

        if (!authorId || !snippetIds?.length) {
            return NextResponse.json(
                { success: false, message: "authorId and snippetIds are required" },
                { status: 400 }
            );
        }

        const existing = await db.bookmark.findFirst({
            where: { authorId },
        });

        if (existing?.snippetIds.includes(snippetIds[0])) {
            return NextResponse.json(
                { success: false, message: "Snippet already bookmarks" },
                { status: 400 }
            );
        }

        let bookmark;
        if (existing) {
            bookmark = await db.bookmark.update({
                where: { id: existing.id },
                data: {
                    snippetIds: {
                        push: snippetIds,
                    },
                },
            });
        } else {
            bookmark = await db.bookmark.create({
                data: {
                    authorId,
                    snippetIds,
                },
            });
        }

        return NextResponse.json(
            { success: true, message: "Bookmark updated", data: bookmark },
            { status: existing ? 200 : 201 }
        );
    } catch (error: any) {
        console.error("Error creating/updating bookmark:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save bookmark", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const bookmarks = await db.bookmark.findMany({
            where: { authorId: session.user.id },
        });

        const snippetIds = bookmarks.flatMap(b => b.snippetIds);

        const snippets = await db.snippet.findMany({
            where: { id: { in: snippetIds } },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const snippetsWithFlag = snippets.map(snippet => ({
            ...snippet,
            isBookmarked: snippetIds.includes(snippet.id),
        }));

        return NextResponse.json({
            success: true,
            message: "Bookmarks fetched successfully",
            data: snippetsWithFlag,
        });
    } catch (error: any) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch bookmarks", error: error.message },
            { status: 500 }
        );
    }
}
