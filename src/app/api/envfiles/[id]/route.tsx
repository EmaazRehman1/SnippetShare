import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { encrypt } from "@/utils/encryption";
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    let updateData = { ...data };

    if (data.code) {
      const encrypted = encrypt(data.code);
      updateData.code = JSON.stringify(encrypted); 
    }

    const resp = await db.snippet.update({
      where: { id },
      data: updateData,
    });

    if (!resp) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update Env",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resp,
      message: "Env updated successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update Env" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    
    const resp = await db.snippet.delete({
      where: {
        id: id
      }
    });

    if(!resp){
      return NextResponse.json({
        success: false,
        message: "No env file found"
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Env deleted successfully" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete Env"
    }, { status: 500 });
  }
}