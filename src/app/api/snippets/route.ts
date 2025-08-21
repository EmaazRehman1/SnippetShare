import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Param } from "@prisma/client/runtime/library";
// import { Session } from "node:inspector";
import { Session } from "next-auth";
import { auth } from "@/auth";
export async function GET(req: Request) {
  const session = await auth();

  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const searchText = searchParams.get("searchText") || "";
    const language = searchParams.get("language") || "";

    const skipRecords = (page - 1) * limit;

    const userBookmarks = session?.user?.id
      ? await db.bookmark.findFirst({
          where: { authorId: session.user.id },
          select: { snippetIds: true },
        })
      : null;

    const filters: any = {
      isPublic: true,
      ...(searchText
        ? {
            OR: [
              {
                title: { contains: searchText, mode: "insensitive" },
              },
              {
                description: { contains: searchText, mode: "insensitive" },
              },
            ],
          }
        : {}),
    };

    if (language) {
      filters.language = { equals: language };
    }

    const total = await db.snippet.count({ where: filters });

    const snippets = await db.snippet.findMany({
      where: filters,
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skipRecords,
      take: limit,
    });

    const bookmarkIds = new Set(userBookmarks?.snippetIds || []);

    const snippetsWithBookmarkFlag = snippets.map((snippet) => ({
      ...snippet,
      isBookmarked: bookmarkIds.has(snippet.id),
    }));

    return NextResponse.json({
      success: true,
      snippets: snippetsWithBookmarkFlag,
      message: "Snippets fetched successfully",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch snippets",
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const resp = await db.snippet.create({ data: body })
        revalidatePath('/feed')

        return NextResponse.json({
            success: true,
            message: "Snippet created successfully!",
            snippet: resp
        }, { status: 200 })

    } catch (error: any) {

        console.error("Error creating snippet:", error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create snippet",
                error: error.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}

