import { NextResponse } from "next/server"
import client from "@/lib/mongodb"

type OrderStatus =
    | "pending_verification"
    | "processing"
    | "dispatched"
    | "delivered"
    | "cancelled"
    | "rejected"

function startOfToday() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

export async function GET() {
    try {
        const mongo = await client.connect()
        const db = mongo.db()

        const ordersCol = db.collection("orders")
        const productsCol = db.collection("products")

        const totalOrders = await ordersCol.countDocuments()
        const totalProducts = await productsCol.countDocuments()

        const revenueAgg = await ordersCol
            .aggregate([{ $match: { status: { $nin: ["cancelled", "rejected"] } } }, { $group: { _id: null, sum: { $sum: "$total" } } }])
            .toArray()

        const revenue = Number(revenueAgg?.[0]?.sum || 0)

        const productsOutOfStock = await productsCol.countDocuments({ inStock: false })

        const pendingOrders = await ordersCol.countDocuments({ status: "pending_verification" })

        const today = startOfToday()
        const dispatchedToday = await ordersCol.countDocuments({
            status: "dispatched",
            createdAt: { $gte: today.toISOString() },
        })

        const recentOrders = await ordersCol
            .find({})
            .sort({ createdAt: -1 })
            .limit(6)
            .project({ form: 1, total: 1, status: 1, createdAt: 1 })
            .toArray()

        const data = {
            totalOrders,
            totalProducts,
            totalCustomers: 0,
            revenue,
            productsOutOfStock,
            pendingOrders,
            dispatchedToday,
            recentOrders,
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Server error" },
            { status: 500 }
        )
    }
}
