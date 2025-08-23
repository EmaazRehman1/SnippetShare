import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request,{ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();

    const resp = await db.snippet.update({
      where: {
        id: id, 
      },
      data,
    });

    if(!resp){
        return NextResponse.json({
            success: false,
            message: "Failed to update Env"
        })
    }

    return NextResponse.json({ success: true, data: resp ,message:"Env updated successfully"});
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update Env" },
      { status: 500 }
    );
  }
}


export async function DELETE(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}=params;
        const resp=await db.snippet.delete({
            where:{
                id:id
            }
        });

        if(!resp){
            return NextResponse.json({
                success: false,
                message: "No env file found"
            })
        }

        return NextResponse.json({ success: true, message: "Env deleted successfully" });

    }catch(Error){
        console.error(Error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete Env"
        });
    }
}