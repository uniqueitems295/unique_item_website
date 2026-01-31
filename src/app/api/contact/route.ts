import { NextResponse } from "next/server"
import client from "@/lib/mongodb"

function isEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const firstName = String(body?.firstName ?? "").trim()
        const lastName = String(body?.lastName ?? "").trim()
        const email = String(body?.email ?? "").trim()
        const whatsapp = String(body?.whatsapp ?? "").trim()
        const subject = String(body?.subject ?? "").trim()
        const message = String(body?.message ?? "").trim()

        if (!firstName || !lastName || !email || !whatsapp || !subject || !message) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 })
        }

        if (!isEmail(email)) {
            return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const col = db.collection("contact_messages")

        const doc = {
            firstName,
            lastName,
            email,
            whatsapp,
            subject,
            message,
            status: "new",
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await col.insertOne(doc)

        return NextResponse.json(
            { message: "Message submitted successfully.", id: result.insertedId },
            { status: 201 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const q = String(searchParams.get("q") ?? "").trim()
        const status = String(searchParams.get("status") ?? "all").trim()

        const mongo = await client.connect()
        const db = mongo.db()
        const col = db.collection("contact_messages")

        const filter: any = {}

        if (status !== "all") filter.status = status

        if (q) {
            filter.$or = [
                { firstName: { $regex: q, $options: "i" } },
                { lastName: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { whatsapp: { $regex: q, $options: "i" } },
                { subject: { $regex: q, $options: "i" } },
            ]
        }

        const items = await col.find(filter).sort({ _id: -1 }).toArray()

        return NextResponse.json({ messages: items }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
