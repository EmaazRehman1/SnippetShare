import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req:Request) {
    try {
        const { email, otp } = await req.json();
        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: "Email & OTP required" },
                { status: 400 }
            );
        }

        // Find OTP record
        const otpRecord = await db.otp.findFirst({
            where: { email, otp },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (otpRecord.expiresAt < new Date()) {
            return NextResponse.json(
                { success: false, message: "OTP expired" },
                { status: 400 }
            );
        }

        // Update as verified
        await db.otp.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });

        // Set cookie (valid for 1 day)
        const res = NextResponse.json({
            success: true,
            message: "OTP verified successfully",
        });

        res.cookies.set("isVerified", "true", {
            httpOnly: true,   // prevent access from JS
            secure: process.env.NODE_ENV === "production", // only https in prod
            sameSite: "strict",
            maxAge: 24 * 60 * 60, // 1 day
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify OTP" },
            { status: 500 }
        );
    }
}
