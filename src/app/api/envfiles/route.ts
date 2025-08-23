import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const env = await db.snippet.create({
            data: {
                ...body,
                isPublic: false,
            },
        });

        return NextResponse.json({
            message: "Environment variable file stored",
            data: env,
        });
    } catch (error: any) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export async function GET(){
    const session = await auth();
    const id=session?.user?.id;
    console.log(id);
    try {
        const envFiles = await db.snippet.findMany({
            where:{
                authorId:id,
                isPublic:false
            },
            include:{
                author:{
                    select:{
                        id:true,
                        email:true,
                        name:true,
                    }
                }
            }
        });
        return NextResponse.json({
            message: "Environment variable files fetched successfully",
            data: envFiles,
        });
    } catch (error: any) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
