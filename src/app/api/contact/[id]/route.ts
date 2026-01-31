import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import { ObjectId } from "mongodb"

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 })
        }

        const body = await req.json()
        const status = String(body?.status ?? "").trim()

        if (!["new", "replied"].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const col = db.collection("contact_messages")

        const result = await col.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Updated" }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}

export async function DELETE(_: Request, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const col = db.collection("contact_messages")

        const result = await col.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Deleted" }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
