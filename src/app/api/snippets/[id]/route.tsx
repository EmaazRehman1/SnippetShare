import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { success } from "zod";

type Params = {
    params: {
        id: string
    }
}


export async function GET(req: Request, { params }: Params) {
  const { id: userId } = params;

  try {
    const snippets = await db.snippet.findMany({
      where: {
        authorId: userId, // adjust if your field is named differently
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


export async function DELETE(req: Request,{params}:Params){
    try{
        const {id}=params;
        const data=await db.snippet.delete({
            where:{
                id:id
            }
        })
        if(!data){
            return NextResponse.json(
                { success: false, message: "Snippet not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, message: "Snippet deleted successfully" },
            { status: 200 }
        );
    }catch(error:any){
            return NextResponse.json(
                { success: false, message: "Failed to Delete snippet", error: error.message },
                { status: 500 }
            );
    }
}

export async function PUT(req: Request,{params}:Params){
    try{
        const {id}=params;
        const body=await req.json();
        const snippet=await db.snippet.update({
            where:{
                id:id
            },
            data:body
        });
        return NextResponse.json(
            { success: true, snippet },
            { status: 200 }
        );
    }catch(error:any){
        return NextResponse.json(
            { success: false, message: "Failed to update snippet", error: error.message },
            { status: 500 }
        );
    }
}
