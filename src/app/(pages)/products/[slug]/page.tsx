"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    Star,
    Truck,
    ShieldCheck,
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    ShoppingCart,
    ShoppingBag,
    Check,
    ChevronRight as BreadcrumbSeparator
} from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"

import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

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
    color?: string
    qty: number
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `Rs. ${v.toLocaleString("en-US")}`
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

function VideoPlayer({ src, isActive }: { src: string; isActive: boolean }) {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = React.useState(true)

    React.useEffect(() => {
        if (!videoRef.current) return
        if (isActive) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
        } else {
            videoRef.current.pause()
            setIsPlaying(false)
        }
    }, [isActive])

    const togglePlay = () => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
        }
    }

    return (
        <div className="relative h-full w-full bg-zinc-950 overflow-hidden group/vid">
            <video
                ref={videoRef}
                src={src}
                playsInline
                loop
                muted
                className="h-full w-full object-cover"
            />
            <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/80 shadow-lg"
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
        </div>
    )
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
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(null)

    const items = React.useMemo(() => {
        const imgs = (product?.images || []).map((u) => safeImage(u))
        const vids = (product?.videos || []).filter((v) => v?.trim())
        const arr: { type: "image" | "video"; src: string }[] = []

        for (const i of imgs) arr.push({ type: "image", src: i })
        for (const v of vids) arr.push({ type: "video", src: v })

        if (arr.length === 0) {
            arr.push({ type: "image", src: "/images/placeholder.png" })
        }
        return arr
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
                const found = products.find((p) => p.slug === slug)

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
                toast.error("Failed to load product details")
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
        toast.success("Added to your shopping cart")
    }

    const discountPercentage = React.useMemo(() => {
        if (!product?.oldPrice || product.oldPrice <= product.price) return 0
        return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    }, [product])

    return (
        <UserWrapper>
            <div className="min-h-screen bg-[#FCFCFD] text-zinc-900 selection:bg-[#C9A15C]/20">
                <section className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
                    <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3.5 text-xs text-zinc-500 sm:px-6 lg:px-8 sm:text-sm">
                        <Link href="/" className="transition-colors hover:text-zinc-900">Home</Link>
                        <BreadcrumbSeparator className="h-3.5 w-3.5 text-zinc-400" />
                        <Link href="/shop" className="transition-colors hover:text-zinc-900">Shop</Link>
                        {product?.category && (
                            <>
                                <BreadcrumbSeparator className="h-3.5 w-3.5 text-zinc-400" />
                                <span className="capitalize">{product.category}</span>
                            </>
                        )}
                        <BreadcrumbSeparator className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-none">
                            {product?.name || "Product"}
                        </span>
                    </div>
                </section>

                {loading ? (
                    <div className="flex h-[60vh] items-center justify-center">
                        <Spinner className="h-8 w-8 text-[#C9A15C]" />
                    </div>
                ) : !product ? (
                    <div className="mx-auto max-w-md px-4 py-28 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-6">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-light tracking-tight text-zinc-900 font-serif">Product Not Found</h2>
                        <p className="mt-2 text-sm text-zinc-500">The timepiece you are looking for may have been archived or retired.</p>
                        <Button asChild className="mt-8 rounded-full bg-zinc-900 px-8 py-6 text-xs uppercase tracking-widest text-white hover:bg-zinc-800">
                            <Link href="/shop">Explore Collection</Link>
                        </Button>
                    </div>
                ) : (
                    <section className="py-10 lg:py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                                <div className="lg:col-span-7 flex flex-col gap-4">
                                    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
                                        {/* Aspect-ratio spacer — 4:5 on mobile/tablet, 1:1 on desktop */}
                                        <div className="relative w-full" style={{ paddingBottom: "min(125%, 100vw)" }}>
                                            <div className="absolute inset-0">
                                                <Swiper
                                                    modules={[Pagination, Navigation]}
                                                    slidesPerView={1}
                                                    onSwiper={setSwiperInstance}
                                                    onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                                                    loop={items.length > 1}
                                                    pagination={{
                                                        clickable: true,
                                                        el: ".product-custom-pagination",
                                                        bulletClass: "prod-bullet",
                                                        bulletActiveClass: "prod-bullet-active",
                                                    }}
                                                    navigation={{
                                                        prevEl: ".prod-prev-btn",
                                                        nextEl: ".prod-next-btn",
                                                    }}
                                                    style={{ height: "100%", width: "100%" }}
                                                >
                                                    {items.map((item, idx) => (
                                                        <SwiperSlide key={`${product._id}-${idx}`} style={{ height: "100%" }}>
                                                            <div className="relative h-full w-full bg-zinc-50">
                                                                {item.type === "image" ? (
                                                                    <Image
                                                                        src={item.src}
                                                                        alt={product.name}
                                                                        fill
                                                                        priority={idx === 0}
                                                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                                                        className="object-cover object-center"
                                                                    />
                                                                ) : (
                                                                    <VideoPlayer
                                                                        src={item.src}
                                                                        isActive={currentSlide === idx}
                                                                    />
                                                                )}
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>

                                                <button
                                                    type="button"
                                                    aria-label="Previous image"
                                                    className="prod-prev-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-900 shadow-md backdrop-blur-md transition-all duration-300 hover:border-[#C9A15C] hover:bg-white hover:text-[#C9A15C] active:scale-95 lg:opacity-0 lg:group-hover:opacity-100"
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>

                                                <button
                                                    type="button"
                                                    aria-label="Next image"
                                                    className="prod-next-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-900 shadow-md backdrop-blur-md transition-all duration-300 hover:border-[#C9A15C] hover:bg-white hover:text-[#C9A15C] active:scale-95 lg:opacity-0 lg:group-hover:opacity-100"
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>

                                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                    {discountPercentage > 0 && (
                                                        <span className="rounded-full bg-zinc-900 px-3.5 py-1 text-[11px] font-medium tracking-wider uppercase text-white shadow-sm">
                                                            Save {discountPercentage}%
                                                        </span>
                                                    )}
                                                    {!product.inStock && (
                                                        <span className="rounded-full bg-rose-500 px-3.5 py-1 text-[11px] font-medium tracking-wider uppercase text-white shadow-sm">
                                                            Sold Out
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md product-custom-pagination" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {items.length > 1 && (
                                        <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 scrollbar-hide">
                                            {items.map((it, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => swiperInstance?.slideToLoop(i)}
                                                    className={`relative shrink-0 w-16 h-16 sm:w-auto sm:h-auto sm:aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 bg-zinc-950 ${
                                                        currentSlide === i
                                                            ? "border-[#C9A15C] ring-2 ring-[#C9A15C]/20 shadow-sm opacity-100"
                                                            : "border-zinc-200 opacity-70 hover:opacity-100"
                                                    }`}
                                                >
                                                    {it.type === "image" ? (
                                                        <Image
                                                            src={it.src}
                                                            alt=""
                                                            fill
                                                            sizes="100px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="relative h-full w-full">
                                                            <video
                                                                src={it.src}
                                                                muted
                                                                playsInline
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-zinc-900 shadow">
                                                                    <Play className="h-3 w-3 fill-zinc-900 ml-0.5" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-5 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs uppercase tracking-widest font-semibold text-[#C9A15C]">
                                                    {product.collection || product.category}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <Star key={i} className="h-4 w-4 fill-current" />
                                                    ))}
                                                    <span className="ml-1.5 text-xs font-semibold text-zinc-700">4.9</span>
                                                </div>
                                            </div>

                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-950 leading-tight">
                                                {product.name}
                                            </h1>

                                            <div className="flex items-baseline gap-3 pt-2">
                                                <span className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950">
                                                    {formatPKR(product.price)}
                                                </span>
                                                {product.oldPrice && product.oldPrice > product.price && (
                                                    <span className="text-lg font-medium text-red-500 line-through">
                                                        {formatPKR(product.oldPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-px w-full bg-zinc-200" />

                                        {colors.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                        Select Color Variant
                                                    </span>
                                                    <span className="text-xs font-medium text-zinc-900 capitalize">
                                                        {selectedColor || "None selected"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2.5">
                                                    {colors.map((c) => {
                                                        const active = selectedColor.toLowerCase() === c.toLowerCase()

                                                        return (
                                                            <button
                                                                key={c}
                                                                type="button"
                                                                onClick={() => setSelectedColor(c)}
                                                                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-200 ${
                                                                    active
                                                                        ? "border-zinc-300 bg-zinc-100 text-black shadow-xs ring-1 ring-zinc-400"
                                                                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                                                                }`}
                                                            >
                                                                <span>{c}</span>
                                                                {active && (
                                                                    <Check className="h-3.5 w-3.5 text-zinc-900" />
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                Product Description
                                            </span>
                                            <p className="text-base sm:text-lg leading-relaxed text-zinc-700 font-normal">
                                                {product.description || "Precision-crafted luxury horology piece built with surgical steel casing, high-grade automatic movement, and a scratch-resistant sapphire crystal."}
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                onClick={handleAdd}
                                                disabled={!product.inStock || mustPickColor}
                                                className={`relative h-12 cursor-pointer w-full rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                                                    added
                                                        ? "bg-[#C9A15C] text-zinc-950 hover:bg-[#b58e4b] shadow-[0_4px_20px_rgba(201,161,92,0.3)]"
                                                        : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl"
                                                }`}
                                            >
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <ShoppingCart className="h-5 w-5" />
                                                    <span>
                                                        {mustPickColor ? "Select a Color" : added ? "View in Cart" : "Add to Cart"}
                                                    </span>
                                                </div>
                                            </Button>
                                        </div>

                                        <div className="space-y-5 pt-4">
                                            <p className="text-sm leading-relaxed text-zinc-600">
                                                Every timepiece includes our comprehensive 7-day money-back guarantee alongside an official 2-year international warranty covering all internal mechanical movements. Orders are carefully packaged in a premium display presentation box and delivered complimentary via express insured courier.
                                            </p>

                                            <div className="flex items-center justify-between gap-4 text-xs text-zinc-700 pt-2 border-t border-zinc-100">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-[#C9A15C]" />
                                                    <span className="font-medium">Free Express Delivery</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4 text-[#C9A15C]" />
                                                    <span className="font-medium">2-Year Official Warranty</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <RefreshCcw className="h-4 w-4 text-[#C9A15C]" />
                                                    <span className="font-medium">7-Day Easy Returns</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <style jsx global>{`
                .prod-bullet {
                    display: inline-block;
                    width: 20px;
                    height: 3px;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .prod-bullet-active {
                    background: #C9A15C;
                    width: 36px;
                }
            `}</style>
        </UserWrapper>
    )
}