"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

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

function formatPKR(value: number) {
    const v = Number.isFinite(value) ? value : 0
    return `Rs.${v.toLocaleString("en-US")}.00`
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

function readCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem("cart")
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed
    } catch {
        return []
    }
}

function writeCart(items: CartItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(items))
}

function addToCart(item: Omit<CartItem, "qty">) {
    const cart = readCart()
    const idx = cart.findIndex((x) => x.id === item.id)
    if (idx >= 0) {
        cart[idx] = { ...cart[idx], qty: (cart[idx].qty || 1) + 1 }
    } else {
        cart.push({ ...item, qty: 1 })
    }
    writeCart(cart)
    return cart
}

export default function AllWatchesSection() {
    const [loading, setLoading] = React.useState(true)
    const [products, setProducts] = React.useState<Product[]>([])
    const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({})

    const syncAddedState = React.useCallback(() => {
        const cart = readCart()
        const map: Record<string, boolean> = {}
        for (const item of cart) map[item.id] = true
        setAddedIds(map)
    }, [])

    const fetchProducts = React.useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get("/api/products")
            const list: Product[] = res.data?.products || []
            const published = list.filter((p) => p.status === "published")
            setProducts(published.slice(0, 8))
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to load products")
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchProducts()
        syncAddedState()

        const onStorage = (e: StorageEvent) => {
            if (e.key === "cart") syncAddedState()
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [fetchProducts, syncAddedState])

    const handleAdd = (p: Product) => {
        if (!p.inStock) return
        addToCart({
            id: p._id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            imageUrl: safeImage(p.imageUrl),
        })
        setAddedIds((prev) => ({ ...prev, [p._id]: true }))
        toast("Added to cart.")
    }

    return (
        <section className="w-full">
            <div className="mx-auto max-w-7xl px-4 pt-8 lg:pt-10">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                            All Watches
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600 sm:text-base">
                            Explore our latest watches with premium design and clean style.
                        </p>
                    </div>

                    <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
                        <Link href="/shop" className="inline-flex items-center gap-2">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border bg-zinc-50 p-4">
                                <div className="aspect-[4/5] w-full rounded-xl bg-zinc-200/60" />
                                <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200/60" />
                                <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200/60" />
                                <div className="mt-5 h-11 w-full rounded-full bg-zinc-200/60" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-y-20 gap-y-10 lg:grid-cols-4">
                        {products.map((p) => {
                            const discount =
                                typeof p.oldPrice === "number" && p.oldPrice > p.price
                                    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                                    : null

                            const added = Boolean(addedIds[p._id])

                            return (
                                <div key={p._id} className="group">
                                    <div className="relative overflow-hidden rounded-2xl bg-zinc-50">
                                        <Link href={`/products/${p.slug}`} className="block">
                                            <div className="relative aspect-[4/5] w-full">
                                                <Image
                                                    src={safeImage(p.imageUrl)}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            </div>
                                        </Link>

                                        {discount !== null && (
                                            <div className="absolute left-3 top-3 grid place-items-center rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white">
                                                -{discount}%
                                            </div>
                                        )}

                                        {!p.inStock && (
                                            <div className="absolute left-3 top-16 grid place-items-center rounded-full bg-zinc-500 px-4 py-3 text-sm font-medium text-white">
                                                Sold out
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <Link
                                            href={`/products/${p.slug}`}
                                            className="line-clamp-1 text-sm font-medium text-zinc-900 hover:underline"
                                        >
                                            {p.name}
                                        </Link>

                                        <div className="mt-2 flex items-center gap-2">
                                            {typeof p.oldPrice === "number" && (
                                                <span className="text-sm text-zinc-500 line-through">
                                                    {formatPKR(p.oldPrice)}
                                                </span>
                                            )}
                                            <span className="text-sm font-semibold text-red-600">
                                                {formatPKR(p.price)}
                                            </span>

                                            {!p.inStock && (
                                                <Badge variant="secondary" className="ml-auto rounded-full">
                                                    Sold Out
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            {added ? (
                                                <Button asChild className="h-11 w-full rounded-full">
                                                    <Link href="/cart">View Cart</Link>
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "h-11 w-full rounded-full border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white",
                                                        !p.inStock && "pointer-events-none opacity-60"
                                                    )}
                                                    onClick={() => handleAdd(p)}
                                                    disabled={!p.inStock}
                                                >
                                                    ADD TO CART
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="mt-10 flex justify-center sm:hidden">
                    <Button asChild className="rounded-full px-6">
                        <Link href="/shop" className="inline-flex items-center gap-2">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
