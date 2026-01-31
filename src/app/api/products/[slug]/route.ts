import { NextResponse } from "next/server"
import client from "@/lib/mongodb"

type Ctx = { params: Promise<{ slug: string }> }

export async function GET(_: Request, ctx: Ctx) {
    try {
        const { slug } = await ctx.params

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection("products")

        const product = await products.findOne({ slug, status: "published" })
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ product }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
