import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const secret = body?.secret

        if (!process.env.ADMIN_SEED_SECRET) {
            return NextResponse.json(
                { message: "ADMIN_SEED_SECRET is not set" },
                { status: 500 }
            )
        }

        if (secret !== process.env.ADMIN_SEED_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim()
        const password = process.env.ADMIN_PASSWORD || ""

        if (!email || !password) {
            return NextResponse.json(
                { message: "ADMIN_EMAIL / ADMIN_PASSWORD not set" },
                { status: 500 }
            )
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const admins = db.collection("admins")

        const exists = await admins.findOne({ email })
        if (exists) {
            return NextResponse.json({ message: "Admin already exists" }, { status: 200 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        await admins.insertOne({
            email,
            passwordHash,
            role: "admin",
            createdAt: new Date(),
        })

        return NextResponse.json({ message: "Admin created" }, { status: 201 })
    } catch (err: any) {
        return NextResponse.json(
            { message: "Server error", error: err?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
