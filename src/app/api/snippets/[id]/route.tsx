import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { success } from "zod";

type Params = {
    params: {
        id: string
    }
}


export async function GET(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const snippet = db.snippet.findUnique({
            where: {
                id
            },
            include: {

                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!snippet) {
            return NextResponse.json({
                success: false,
                message: "Snippet not found"
            },
                {
                    status: 404
                })
        }
        return NextResponse.json({
            success: true,
            snippets: snippet,
            message: "Snippet retrieved successfully"
        })

    } catch (error:any) {
        console.error("Error fetching snippet:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch snippet", error: error.message },
            { status: 500 }
        );

    }

}