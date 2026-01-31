"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Star, Truck, ShieldCheck, RefreshCcw } from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"

type Product = {
    _id: string
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

type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    qty: number
}

/* ---------- helpers (same as shop page) ---------- */

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `Rs.${v.toLocaleString("en-US")}.00`
}

function readCart(): CartItem[] {
    try {
        const raw = localStorage.getItem("cart")
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeCart(items: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(items))
}

function addToCart(item: Omit<CartItem, "qty">) {
    const cart = readCart()
    const idx = cart.findIndex((x) => x.id === item.id)

    if (idx >= 0) {
        cart[idx].qty += 1
    } else {
        cart.push({ ...item, qty: 1 })
    }

    writeCart(cart)
}

function isInCart(id: string) {
    return readCart().some((x) => x.id === id)
}

/* ---------- page ---------- */

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params)


    const [loading, setLoading] = React.useState(true)
    const [product, setProduct] = React.useState<Product | null>(null)
    const [added, setAdded] = React.useState(false)

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)

                const res = await axios.get("/api/products")
                const products: Product[] = res.data?.products || []

                const found = products.find(
                    (p) => p.slug === slug && p.status === "published"
                )

                if (!found) {
                    setProduct(null)
                    return
                }

                setProduct(found)
                setAdded(isInCart(found._id))
            } catch {
                toast("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    const handleAdd = () => {
        if (!product) return

        if (added) {
            window.location.href = "/cart"
            return
        }

        addToCart({
            id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: safeImage(product.imageUrl),
        })

        setAdded(true)
        toast("Added to cart")
    }

    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                {/* Breadcrumb */}
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-zinc-600">
                        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
                        <span className="text-zinc-900 font-medium">
                            {product?.name || "Product"}
                        </span>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner />
                    </div>
                ) : !product ? (
                    <div className="text-center py-24">
                        <h2 className="text-2xl font-semibold">Product not found</h2>
                        <p className="text-zinc-600 mt-2">
                            This product may be removed or unpublished.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/shop">Back to shop</Link>
                        </Button>
                    </div>
                ) : (
                    <section className="py-12">
                        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-2">
                            {/* Image */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50">
                                <Image
                                    src={safeImage(product.imageUrl)}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="space-y-6">
                                <Badge>{product.category}</Badge>

                                <h1 className="text-3xl font-semibold">{product.name}</h1>

                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 fill-black" />
                                    ))}
                                </div>

                                <div className="flex gap-3 items-end">
                                    <p className="text-3xl font-bold">
                                        {formatPKR(product.price)}
                                    </p>
                                    {product.oldPrice && (
                                        <p className="line-through text-zinc-500">
                                            {formatPKR(product.oldPrice)}
                                        </p>
                                    )}
                                </div>

                                <p className="text-zinc-600">
                                    {product.description || "No description available."}
                                </p>

                                <Button
                                    onClick={handleAdd}
                                    className="h-11 rounded-xl w-full"
                                    disabled={!product.inStock}
                                >
                                    {added ? "View Cart" : "Add to Cart"}
                                </Button>

                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="flex gap-2 text-sm">
                                        <Truck /> Fast Delivery
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <ShieldCheck /> Warranty
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <RefreshCcw /> Easy Returns
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </UserWrapper>
    )
}
