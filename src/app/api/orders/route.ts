import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import type { OrderDoc } from "@/lib/types/order"

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Partial<OrderDoc>

        if (!body.form) return NextResponse.json({ message: "Missing form" }, { status: 400 })
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 })
        }
        if (!body.paymentProofUrl) {
            return NextResponse.json({ message: "Payment proof is required" }, { status: 400 })
        }

        const subtotal = Number(body.subtotal || 0)
        const shipping = Number(body.shipping || 0)
        const total = Number(body.total || 0)

        const doc: OrderDoc = {
            form: {
                firstName: String(body.form.firstName || ""),
                lastName: String(body.form.lastName || ""),
                phone: String(body.form.phone || ""),
                email: String(body.form.email || ""),
                address: String(body.form.address || ""),
                city: String(body.form.city || ""),
                postal: String(body.form.postal || ""),
                paymentMethod: body.form.paymentMethod === "online" ? "online" : "cod",
            },

            items: body.items.map((i: any) => ({
                id: String(i.id || ""),
                slug: String(i.slug || ""),
                name: String(i.name || ""),
                price: Number(i.price || 0),
                imageUrl: String(i.imageUrl || ""),
                qty: Number(i.qty || 1),
            })),

            subtotal,
            shipping,
            total,

            paymentProofUrl: String(body.paymentProofUrl),

            receiver: body.receiver
                ? {
                    name: String(body.receiver.name || ""),
                    easypaisaMsisdn: String(body.receiver.easypaisaMsisdn || ""),
                }
                : undefined,

            status: "pending_verification",
            createdAt: new Date().toISOString(),
        }


        if (!doc.form.firstName || !doc.form.lastName || !doc.form.phone || !doc.form.address || !doc.form.city) {
            return NextResponse.json({ message: "Please complete shipping details" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const orders = db.collection<OrderDoc>("orders")

        const result = await orders.insertOne(doc as any)

        return NextResponse.json(
            { message: "Order created", orderId: String(result.insertedId) },
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
        const q = (searchParams.get("q") || "").trim().toLowerCase()
        const status = (searchParams.get("status") || "all").trim().toLowerCase()

        const mongo = await client.connect()
        const db = mongo.db()
        const orders = db.collection("orders")

        const filter: any = {}

        if (status !== "all") filter.status = status

        if (q) {
            filter.$or = [
                { "form.firstName": { $regex: q, $options: "i" } },
                { "form.lastName": { $regex: q, $options: "i" } },
                { "form.phone": { $regex: q, $options: "i" } },
                { paymentProofUrl: { $regex: q, $options: "i" } },
            ]
        }

        const list = await orders
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(200)
            .toArray()

        return NextResponse.json({ orders: list }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}