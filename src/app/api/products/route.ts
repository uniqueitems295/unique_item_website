import { NextResponse } from "next/server"
import client from "@/lib/mongodb"

export async function GET() {
    try {
        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection("products")

        const data = await products
            .find({ status: "published" })
            .sort({ _id: -1 })
            .toArray()

        return NextResponse.json({ products: data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
