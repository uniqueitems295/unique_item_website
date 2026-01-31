import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import { ObjectId } from "mongodb"

type ProductPayload = {
    name: string
    slug: string
    price: number
    oldPrice?: number | null
    category: string
    collection: string
    description?: string
    imageUrl?: string
    status: "published" | "draft"
    inStock: boolean
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const slug = searchParams.get("slug")?.trim()
        const id = searchParams.get("id")?.trim()

        const q = searchParams.get("q")?.trim()
        const status = searchParams.get("status")?.trim()
        const limitRaw = searchParams.get("limit")?.trim()
        const limit = limitRaw ? Math.max(1, Math.min(200, Number(limitRaw))) : 200

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection("products")

        if (slug) {
            const product = await products.findOne({ slug })
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })
            return NextResponse.json({ product }, { status: 200 })
        }

        if (id) {
            const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
            const product = await products.findOne(filter as any)
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })
            return NextResponse.json({ product }, { status: 200 })
        }

        const filter: any = {}

        if (status === "published" || status === "draft") {
            filter.status = status
        }

        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: "i" } },
                { slug: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { collection: { $regex: q, $options: "i" } },
            ]
        }

        const data = await products.find(filter).sort({ _id: -1 }).limit(limit).toArray()
        return NextResponse.json({ products: data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as ProductPayload

        const {
            name,
            slug,
            price,
            oldPrice,
            category,
            collection,
            description,
            imageUrl,
            status,
            inStock,
        } = body

        if (!name || !slug || typeof price !== "number" || !category || !collection) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection("products")

        const exists = await products.findOne({ slug })
        if (exists) {
            return NextResponse.json({ message: "Slug already exists" }, { status: 409 })
        }

        const doc = {
            name,
            slug,
            price,
            oldPrice: oldPrice ?? null,
            category,
            collection,
            description: description ?? "",
            imageUrl: imageUrl ?? "",
            status: status ?? "published",
            inStock: inStock ?? true,
        }

        const result = await products.insertOne(doc)

        return NextResponse.json(
            { message: "Product created successfully", id: result.insertedId, product: doc },
            { status: 201 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
