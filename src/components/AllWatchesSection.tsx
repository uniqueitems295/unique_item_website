"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
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
    videos?: string[]
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
    qty: number
}

function formatPKR(value: number) {
    const v = Number.isFinite(value) ? value : 0
    return `Rs.${v.toLocaleString("en-US")}.00`
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

function getCoverImage(p: Product) {
    const first = p.images?.[0]?.trim()
    return safeImage(first)
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

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function AllWatchesSection() {
    const [loading, setLoading] = React.useState(true)
    const [products, setProducts] = React.useState<Product[]>([])
    const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({})
    const [autoplayMs, setAutoplayMs] = React.useState<Record<string, number>>({})

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
            const slice = list.slice(0, 8)

            setProducts(slice)

            const auto: Record<string, number> = {}
            for (const p of slice) auto[p._id] = randInt(4000, 6500)
            setAutoplayMs(auto)
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
            imageUrl: getCoverImage(p),
        })
        setAddedIds((prev) => ({ ...prev, [p._id]: true }))
        toast("Added to cart.")
    }

    return (
        <section className="w-full bg-[#0B0C0E] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col gap-6 border-b border-[#1E1F21] pb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            className="text-[#EDEAE2]"
                            style={{
                                fontFamily: "var(--font-display, serif)",
                                fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                                lineHeight: 1.05,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            All watches
                        </h2>
                        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#9c9a92]">
                            Explore our latest arrivals, built with premium materials and
                            a clean, considered design.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className="group hidden rounded-full items-center gap-2 border border-[#EDEAE2]/25 px-6 py-3 text-sm font-medium text-[#EDEAE2] transition-colors hover:border-[#C9A15C] hover:text-[#C9A15C] sm:inline-flex"
                    >
                        View all
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-14 grid gap-6 md:gap-y-18 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="border border-[#1E1F21] bg-[#111214] p-4">
                                <div className="aspect-[4/5] w-full bg-[#1a1b1d]" />
                                <div className="mt-4 h-3 w-3/4 bg-[#1a1b1d]" />
                                <div className="mt-2 h-3 w-1/2 bg-[#1a1b1d]" />
                                <div className="mt-5 h-11 w-full bg-[#1a1b1d]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-14 grid gap-6 md:gap-y-18 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((p) => {
                            const discount =
                                typeof p.oldPrice === "number" && p.oldPrice > p.price
                                    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                                    : null

                            const added = Boolean(addedIds[p._id])
                            const imgs = (p.images || []).map((u) => safeImage(u))
                            const vidSlides = (p.videos || []).filter((v) => v?.trim())
                            const imgSlides = imgs.length === 0 && vidSlides.length === 0 ? ["/images/placeholder.png"] : imgs
                            const totalSlides = imgSlides.length + vidSlides.length

                            return (
                                <div key={p._id} className="group">
                                    <div className="relative overflow-hidden border border-[#1E1F21] bg-[#111214]">
                                        <Link href={`/products/${p.slug}`} className="block">
                                            <div className="relative aspect-[4/5] w-full">
                                                <Swiper
                                                    modules={[Autoplay]}
                                                    slidesPerView={1}
                                                    spaceBetween={0}
                                                    loop={totalSlides > 1}
                                                    autoplay={
                                                        totalSlides > 1
                                                            ? {
                                                                delay: autoplayMs[p._id] ?? 5000,
                                                                disableOnInteraction: false,
                                                                pauseOnMouseEnter: true,
                                                            }
                                                            : false
                                                    }
                                                    className="h-full w-full"
                                                >
                                                    {imgSlides.map((src, idx) => (
                                                        <SwiperSlide key={`${p._id}-img-${idx}`}>
                                                            <div className="relative h-full w-full">
                                                                <Image
                                                                    src={src}
                                                                    alt={p.name}
                                                                    fill
                                                                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.04]"
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                    {vidSlides.map((src, idx) => (
                                                        <SwiperSlide key={`${p._id}-vid-${idx}`}>
                                                            <div className="relative h-full w-full bg-black">
                                                                <video
                                                                    src={src}
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    playsInline
                                                                    className="absolute inset-0 rounded-lg h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        </Link>

                                        {discount !== null && (
                                            <div
                                                className="absolute left-3 top-3 z-10 border rounded-full border-[#C9A15C] bg-[#0B0C0E] px-2.5 py-1 text-[#C9A15C]"
                                                style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.05em" }}
                                            >
                                                -{discount}%
                                            </div>
                                        )}

                                        {!p.inStock && (
                                            <div
                                                className="absolute left-3 rounded-lg top-12 z-10 border border-[#EDEAE2]/30 bg-[#0B0C0E] px-2.5 py-1 text-[#9c9a92]"
                                                style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.05em" }}
                                            >
                                                Sold out
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <Link
                                            href={`/products/${p.slug}`}
                                            className="line-clamp-1 font-medium text-[#EDEAE2] transition-colors hover:text-[#C9A15C]"
                                        >
                                            {p.name}
                                        </Link>

                                        <div className="mt-2 flex items-center gap-2">
                                            {typeof p.oldPrice === "number" && (
                                                <span
                                                    className="text-[#5f5d56] line-through"
                                                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}
                                                >
                                                    {formatPKR(p.oldPrice)}
                                                </span>
                                            )}
                                            <span
                                                className="text-[#C9A15C]"
                                                style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 14, letterSpacing: "0.02em" }}
                                            >
                                                {formatPKR(p.price)}
                                            </span>

                                            {!p.inStock && (
                                                <span
                                                    className="ml-auto rounded-lg border border-[#EDEAE2]/20 px-2 py-0.5 text-[#9c9a92]"
                                                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.05em" }}
                                                >
                                                    SOLD OUT
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            {added ? (
                                                <Link
                                                    href="/cart"
                                                    className="flex rounded-full h-11 w-full items-center justify-center border border-[#C9A15C] bg-[#C9A15C] text-sm font-medium text-[#0B0C0E] transition-colors hover:bg-transparent hover:text-[#C9A15C]"
                                                >
                                                    View cart
                                                </Link>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAdd(p)}
                                                    disabled={!p.inStock}
                                                    className={cn(
                                                        "flex rounded-full h-11 w-full items-center justify-center border border-[#EDEAE2]/30 text-sm font-medium text-[#EDEAE2] transition-colors hover:border-[#C9A15C] hover:text-[#C9A15C]",
                                                        !p.inStock && "pointer-events-none opacity-40"
                                                    )}
                                                >
                                                    Add to cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="mt-14 flex justify-center sm:hidden">
                    <Link
                        href="/shop"
                        className="group rounded-full inline-flex items-center gap-2 border border-[#EDEAE2]/25 px-7 py-3.5 text-sm font-medium text-[#EDEAE2] transition-colors hover:border-[#C9A15C] hover:text-[#C9A15C]"
                    >
                        View all
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}