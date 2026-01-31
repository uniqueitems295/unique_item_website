import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import { ObjectId, type Filter, type WithId } from "mongodb"

type Ctx = { params: Promise<{ id: string }> }
type Status = "published" | "draft"

type ProductDoc = {
    _id: any
    name: string
    slug: string
    price: number
    oldPrice?: number | null
    category: string
    collection: string
    description?: string
    imageUrl?: string
    status: Status
    inStock: boolean
}

type Product = WithId<ProductDoc>

function idFilter(id: string): Filter<Product> {
    if (ObjectId.isValid(id)) {
        return { $or: [{ _id: new ObjectId(id) as any }, { _id: id as any }] } as any
    }
    return { _id: id as any }
}

export async function GET(_: Request, ctx: Ctx) {
    try {
        const { id } = await ctx.params

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection<Product>("products")

        const product = await products.findOne(idFilter(id))
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

export async function PATCH(req: Request, ctx: Ctx) {
    try {
        const { id } = await ctx.params
        const body = await req.json()

        const allowedFields = [
            "name",
            "price",
            "oldPrice",
            "category",
            "collection",
            "description",
            "imageUrl",
            "status",
            "inStock",
        ] as const

        const updateDoc: Partial<ProductDoc> & Record<string, any> = {}

        for (const key of allowedFields) {
            if (body[key] !== undefined) updateDoc[key] = body[key]
        }

        if (Object.keys(updateDoc).length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 })
        }

        if (updateDoc.price !== undefined) updateDoc.price = Number(updateDoc.price)
        if (updateDoc.oldPrice !== undefined) {
            updateDoc.oldPrice = updateDoc.oldPrice === null ? null : Number(updateDoc.oldPrice)
        }

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection<Product>("products")

        const result = await products.updateOne(idFilter(id), { $set: updateDoc })

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        const product = await products.findOne(idFilter(id))

        return NextResponse.json(
            { message: "Product updated successfully", product },
            { status: 200 }
        )
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

        const mongo = await client.connect()
        const db = mongo.db()
        const products = db.collection<Product>("products")

        const result = await products.deleteOne(idFilter(id))

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: "Server error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
