import axios from "axios"

export type Product = {
    _id: string
    name: string
    slug: string
    price: number
    oldPrice?: number | null
    category: string
    collection: string
    description?: string
    images?: string[]
    videos?: string[]
    colors?: string[]
    status: "published" | "draft"
    inStock: boolean
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await axios.get("/api/products")

    if (!response.data?.products) {
        throw new Error(response.data?.message || "Failed to load products")
    }

    return response.data.products as Product[]
}
