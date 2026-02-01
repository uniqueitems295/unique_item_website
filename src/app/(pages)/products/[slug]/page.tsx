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

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

type Product = {
    _id: string
    name: string
    slug: string
    price: number
    oldPrice?: number | null
    category: string
    collection: string
    description?: string
    images?: string[]
    colors?: string[]
    status: "published" | "draft"
    inStock: boolean
}

type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    color?: string
    qty: number
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `Rs.${v.toLocaleString("en-US")}.00`
}

function getCoverImage(p: Product) {
    const first = p.images?.[0]?.trim()
    return safeImage(first)
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
    const idx = cart.findIndex(
        (x) => x.id === item.id && (x.color || "") === (item.color || "")
    )

    if (idx >= 0) {
        cart[idx] = { ...cart[idx], qty: (cart[idx].qty || 1) + 1 }
    } else {
        cart.push({ ...item, qty: 1 })
    }

    writeCart(cart)
    return cart
}

function isInCart(id: string, color?: string) {
    const c = (color || "").trim().toLowerCase()
    return readCart().some(
        (x) =>
            x.id === id &&
            ((x.color || "").trim().toLowerCase() === c)
    )
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params)

    const [loading, setLoading] = React.useState(true)
    const [product, setProduct] = React.useState<Product | null>(null)

    const [selectedColor, setSelectedColor] = React.useState<string>("")
    const [added, setAdded] = React.useState(false)

    const [autoplayDelay] = React.useState(() => randInt(4000, 6500))

    const slides = React.useMemo(() => {
        const imgs = (product?.images || []).map((u) => safeImage(u))
        return imgs.length > 0 ? imgs : ["/images/placeholder.png"]
    }, [product])

    const colors = React.useMemo(() => {
        const arr = Array.isArray(product?.colors) ? product!.colors! : []
        return arr.map((c) => String(c).trim()).filter(Boolean)
    }, [product])

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)

                const res = await axios.get("/api/products")
                const products: Product[] = res.data?.products || []

                const found = products.find((p) => p.slug === slug && p.status === "published")

                if (!found) {
                    setProduct(null)
                    return
                }

                setProduct(found)

                const firstColor =
                    Array.isArray(found.colors)
                        ? found.colors.map((c) => String(c).trim()).filter(Boolean)[0] || ""
                        : ""

                setSelectedColor(firstColor)

                setAdded(isInCart(found._id, firstColor))
            } catch {
                toast("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    React.useEffect(() => {
        if (!product) return
        setAdded(isInCart(product._id, selectedColor))
    }, [product, selectedColor])

    const mustPickColor = colors.length > 0 && !selectedColor

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
            imageUrl: getCoverImage(product),
            color: selectedColor || undefined,
        })

        setAdded(true)
        toast("Added to cart")
    }

    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-zinc-600">
                        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
                        <span className="text-zinc-900 font-medium">{product?.name || "Product"}</span>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner />
                    </div>
                ) : !product ? (
                    <div className="text-center py-24">
                        <h2 className="text-2xl font-semibold">Product not found</h2>
                        <p className="text-zinc-600 mt-2">This product may be removed or unpublished.</p>
                        <Button asChild className="mt-6">
                            <Link href="/shop">Back to shop</Link>
                        </Button>
                    </div>
                ) : (
                    <section className="py-12">
                        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-2">
                            <div className="relative overflow-hidden rounded-2xl bg-zinc-50">
                                <div className="relative aspect-square w-full">
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        slidesPerView={1}
                                        loop={slides.length > 1}
                                        pagination={{ clickable: true }}
                                        autoplay={
                                            slides.length > 1
                                                ? {
                                                    delay: autoplayDelay,
                                                    disableOnInteraction: false,
                                                    pauseOnMouseEnter: true,
                                                }
                                                : false
                                        }
                                        className="h-full w-full"
                                    >
                                        {slides.map((src, idx) => (
                                            <SwiperSlide key={`${product._id}-${idx}`}>
                                                <div className="relative h-full w-full">
                                                    <Image src={src} alt={product.name} fill className="object-cover" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge>{product.category}</Badge>
                                    {!product.inStock && (
                                        <Badge variant="secondary" className="rounded-full">
                                            Sold Out
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl font-semibold">{product.name}</h1>

                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 fill-black" />
                                    ))}
                                </div>

                                <div className="flex gap-3 items-end">
                                    <p className="text-3xl font-bold">{formatPKR(product.price)}</p>
                                    {product.oldPrice && (
                                        <p className="line-through text-zinc-500">{formatPKR(product.oldPrice)}</p>
                                    )}
                                </div>

                                {colors.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-zinc-900">Available Colors</p>

                                        <div className="flex flex-wrap gap-2">
                                            {colors.map((c) => {
                                                const active = selectedColor === c
                                                return (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => setSelectedColor(c)}
                                                        className={
                                                            "rounded-full border px-4 py-2 text-sm transition " +
                                                            (active
                                                                ? "border-zinc-900 bg-zinc-900 text-white"
                                                                : "border-zinc-200 bg-white hover:bg-zinc-50")
                                                        }
                                                    >
                                                        {c}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {selectedColor && (
                                            <p className="text-xs text-zinc-600">
                                                Selected: <span className="font-medium text-zinc-900">{selectedColor}</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                <p className="text-zinc-600">{product.description || "No description available."}</p>

                                <Button
                                    onClick={handleAdd}
                                    className="h-11 rounded-xl w-full"
                                    disabled={!product.inStock || mustPickColor}
                                >
                                    {mustPickColor ? "Select a Color" : added ? "View Cart" : "Add to Cart"}
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
