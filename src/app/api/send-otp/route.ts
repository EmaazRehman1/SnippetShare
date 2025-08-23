import { NextResponse } from "next/server";
import { db } from "@/lib/db";  // prisma client
import { sendMail } from "@/utils/nodemailer";

export async function POST(req:Request) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save in DB
        await db.otp.create({
            data: {
                email,
                otp,
                expiresAt,
            },
        });

        // Send email
        await sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
            html: `<h3>Your OTP code is <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`,
        });

        return NextResponse.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("Send OTP Error:", error);
        return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
    }
}
