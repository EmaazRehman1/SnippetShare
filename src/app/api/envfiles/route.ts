import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { encrypt, decrypt } from "@/utils/encryption";


export async function POST(req: Request) {
    try {
        const { authorId, title, code, language, description, tags } = await req.json();

        const encrypted = encrypt(code);

        const env = await db.snippet.create({
            data: {
                authorId,
                title,
                description,
                code: JSON.stringify(encrypted),
                language,                        
                tags: tags || [],
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


export async function GET() {
    const session = await auth();
    const id = session?.user?.id;
    console.log(id);
    try {
        const envFiles = await db.snippet.findMany({
            where: {
                authorId: id,
                isPublic: false
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            }
        });
        const decryptedFiles = envFiles.map((file) => ({
            ...file,
            code: decrypt(JSON.parse(file.code)),
        }));
    
        return NextResponse.json({
            message: "Environment variable files fetched successfully",
            data: decryptedFiles,
        });
    } catch (error: any) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
