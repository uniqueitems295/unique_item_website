import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import client from "@/lib/mongodb"

const ALLOWED_STATUSES = new Set([
    "pending_verification",
    "processing",
    "dispatched",
    "delivered",
    "cancelled",
    "rejected",
])

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
    try {
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid order id" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const orders = db.collection("orders")

        const order = await orders.findOne({ _id: new ObjectId(id) })

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({ order }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: Request, { params }: Ctx) {
    try {
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid order id" }, { status: 400 })
        }

        const body = (await req.json()) as { status?: string }
        const status = String(body.status || "").trim()

        if (!ALLOWED_STATUSES.has(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const orders = db.collection("orders")

        const result = await orders.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Status updated" }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
