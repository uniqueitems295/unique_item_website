import { NextResponse } from "next/server"
import { signAdminSession } from "@/lib/adminAuth"
import { verifyAdmin } from "@/lib/admin"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 })
        }

        const admin = await verifyAdmin(email, password)
        if (!admin) {
            return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 })
        }

        const token = signAdminSession(admin)

        const res = NextResponse.json({ message: "Login success", admin }, { status: 200 })
        res.cookies.set("admin_session", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        return res
    } catch (e: any) {
        return NextResponse.json({ message: "Server error", error: e?.message || "Unknown error" }, { status: 500 })
    }
}
