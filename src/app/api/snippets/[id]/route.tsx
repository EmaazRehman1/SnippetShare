import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const { id: userId } = params;

    const snippets = await db.snippet.findMany({
      where: {
        authorId: userId, 
      },
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

    if (!snippets || snippets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No snippets found for this user",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      snippets,
      message: "Snippets retrieved successfully",
    });
  } catch (error: any) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch snippets",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    
    const data = await db.snippet.delete({
      where: {
        id: id
      }
    });
    
    if (!data) {
      return NextResponse.json(
        { success: false, message: "Snippet not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "Snippet deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to Delete snippet", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();
    
    const snippet = await db.snippet.update({
      where: {
        id: id
      },
      data: body
    });
    
    return NextResponse.json(
      { success: true, snippet },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to update snippet", error: error.message },
      { status: 500 }
    );
  }
}