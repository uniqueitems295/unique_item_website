"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, Filter, Search } from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"
import { useSearchParams } from "next/navigation"

type Category = "all" | "men" | "women" | "kids" | "sport"
type Availability = "all" | "in" | "out"

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

const CATEGORIES: { key: Category; label: string }[] = [
    { key: "all", label: "All Watches" },
    { key: "men", label: "Men Watches" },
    { key: "women", label: "Women Watches" },
    { key: "kids", label: "Kids Watches" },
    { key: "sport", label: "Sport Watches" },
]

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `Rs.${v.toLocaleString("en-US")}.00`
}

function getMinMax(products: Product[]) {
    if (!products.length) return { min: 0, max: 10000 }
    const prices = products.map((p) => p.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
}

function normalizeCategory(v: string): Category {
    const s = v.toLowerCase()
    if (s === "men") return "men"
    if (s === "women") return "women"
    if (s === "kids") return "kids"
    if (s === "sport") return "sport"
    return "all"
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

function SidebarFilters({
    category,
    setCategory,
    query,
    setQuery,
    price,
    setPrice,
    availability,
    setAvailability,
    minPrice,
    maxPrice,
}: {
    category: Category
    setCategory: (v: Category) => void
    query: string
    setQuery: (v: string) => void
    price: number[]
    setPrice: (v: number[]) => void
    availability: Availability
    setAvailability: (v: Availability) => void
    minPrice: number
    maxPrice: number
}) {
    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search watches..."
                    className="h-10 rounded-xl pl-9"
                />
            </div>

            <Separator />

            <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-900">Category</p>
                <div className="space-y-2">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => setCategory(c.key)}
                            className={cn(
                                "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition",
                                category === c.key
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                            )}
                        >
                            <span className="flex items-center justify-between">
                                {c.label}
                                <ArrowUpRight className={cn("h-4 w-4 opacity-70", category === c.key && "opacity-100")} />
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-900">Price Range</p>
                <div className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600">{formatPKR(price[0])}</span>
                        <span className="text-zinc-600">{formatPKR(price[1])}</span>
                    </div>
                    <div className="mt-4">
                        <Slider value={price} onValueChange={setPrice} min={minPrice} max={maxPrice} step={10} />
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">Adjust the slider to filter by price.</p>
                </div>
            </div>

            <Separator />

            <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-900">Availability</p>
                <div className="space-y-2 rounded-2xl border bg-white p-4">
                    {[
                        { key: "all", label: "All" },
                        { key: "in", label: "In Stock" },
                        { key: "out", label: "Sold Out" },
                    ].map((a) => (
                        <button
                            key={a.key}
                            type="button"
                            onClick={() => setAvailability(a.key as Availability)}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                                availability === a.key
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                            )}
                        >
                            {a.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProductCard({
    p,
    added,
    onAdd,
}: {
    p: Product
    added: boolean
    onAdd: (p: Product) => void
}) {
    const discount =
        typeof p.oldPrice === "number" && p.oldPrice > p.price
            ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
            : null

    return (
        <div className="group">
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
                    <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                        -{discount}%
                    </div>
                )}

                {!p.inStock && (
                    <div className="absolute left-3 top-12 rounded-full bg-zinc-600 px-3 py-2 text-xs font-medium text-white">
                        Sold out
                    </div>
                )}
            </div>

            <div className="mt-4">
                <Link href={`/products/${p.slug}`} className="line-clamp-2 text-sm font-medium text-zinc-900 hover:underline">
                    {p.name}
                </Link>

                <div className="mt-2 flex items-center gap-2">
                    {typeof p.oldPrice === "number" && (
                        <span className="text-sm text-zinc-500 line-through">{formatPKR(p.oldPrice)}</span>
                    )}
                    <span className="text-sm font-semibold text-red-600">{formatPKR(p.price)}</span>
                    {!p.inStock && (
                        <Badge variant="secondary" className="ml-auto rounded-full">
                            Sold Out
                        </Badge>
                    )}
                </div>

                <div className="mt-4">
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
                            onClick={() => onAdd(p)}
                            disabled={!p.inStock}
                        >
                            ADD TO CART
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

/** ✅ This component can safely use useSearchParams */
function ShopInner() {
    const searchParams = useSearchParams()

    const [loading, setLoading] = React.useState(true)
    const [products, setProducts] = React.useState<Product[]>([])
    const [error, setError] = React.useState("")

    const [category, setCategory] = React.useState<Category>("all")
    const [query, setQuery] = React.useState("")
    const [availability, setAvailability] = React.useState<Availability>("all")
    const [price, setPrice] = React.useState<number[]>([0, 10000])

    const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({})

    const { min, max } = React.useMemo(() => getMinMax(products), [products])

    const syncAddedState = React.useCallback(() => {
        const cart = readCart()
        const map: Record<string, boolean> = {}
        for (const item of cart) map[item.id] = true
        setAddedIds(map)
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await axios.get("/api/products")
            const list: Product[] = res.data?.products || []
            const publishedOnly = list.filter((p) => p.status === "published")
            setProducts(publishedOnly)
        } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchProducts()
        syncAddedState()
    }, [syncAddedState])

    React.useEffect(() => {
        setPrice([min, max])
    }, [min, max])

    /** ✅ read q from URL */
    React.useEffect(() => {
        const q = searchParams.get("q") || ""
        setQuery(q)
    }, [searchParams])

    const clearAll = () => {
        setCategory("all")
        setQuery("")
        setAvailability("all")
        setPrice([min, max])
    }

    const filtered = React.useMemo(() => {
        let list = [...products]

        if (category !== "all") {
            list = list.filter((p) => normalizeCategory(p.category) === category)
        }

        if (query.trim()) {
            const q = query.toLowerCase()
            list = list.filter((p) => p.name.toLowerCase().includes(q))
        }

        list = list.filter((p) => p.price >= price[0] && p.price <= price[1])

        if (availability !== "all") {
            list = list.filter((p) => (availability === "in" ? p.inStock : !p.inStock))
        }

        return list
    }, [products, category, query, price, availability])

    const handleAdd = (p: Product) => {
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
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Shop</h1>
                                <p className="mt-2 text-sm text-zinc-600 sm:text-base">
                                    Explore all watches and filter by category and price.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="rounded-xl lg:hidden">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[340px] overflow-auto pb-5 px-4">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <SidebarFilters
                                            category={category}
                                            setCategory={setCategory}
                                            query={query}
                                            setQuery={setQuery}
                                            price={price}
                                            setPrice={setPrice}
                                            availability={availability}
                                            setAvailability={setAvailability}
                                            minPrice={min}
                                            maxPrice={max}
                                        />
                                        <div className="mt-5">
                                            <Button variant="outline" className="w-full rounded-xl" onClick={clearAll}>
                                                Reset
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 rounded-3xl border bg-zinc-50 p-5">
                                <SidebarFilters
                                    category={category}
                                    setCategory={setCategory}
                                    query={query}
                                    setQuery={setQuery}
                                    price={price}
                                    setPrice={setPrice}
                                    availability={availability}
                                    setAvailability={setAvailability}
                                    minPrice={min}
                                    maxPrice={max}
                                />
                                <div className="mt-5 grid gap-2">
                                    <Button variant="outline" className="rounded-xl" onClick={clearAll}>
                                        Reset
                                    </Button>
                                    <Button variant="outline" className="rounded-xl" onClick={fetchProducts} disabled={loading}>
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </aside>

                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-zinc-600">
                                    Showing <span className="font-semibold text-zinc-900">{filtered.length}</span> results
                                </p>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-700">{error}</div>
                            )}

                            {loading ? (
                                <div className="mt-10 flex items-center justify-center">
                                    <Spinner />
                                </div>
                            ) : (
                                <div className="mt-6 grid gap-5 gap-y-10 md:gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                                    {filtered.map((p) => (
                                        <ProductCard key={p._id} p={p} added={Boolean(addedIds[p._id])} onAdd={handleAdd} />
                                    ))}
                                </div>
                            )}

                            {!loading && filtered.length === 0 && (
                                <div className="mt-10 rounded-3xl border bg-zinc-50 p-10 text-center">
                                    <p className="text-lg font-semibold text-zinc-900">No products found</p>
                                    <p className="mt-2 text-sm text-zinc-600">Try changing filters or reset to see all products.</p>
                                    <Button className="mt-5 rounded-xl" onClick={clearAll}>
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    )
}

/** ✅ Page exported with Suspense wrapper (fixes prerender build error) */
export default function ShopPage() {
    return (
        <Suspense fallback={<div className="p-10">Loading...</div>}>
            <ShopInner />
        </Suspense>
    )
}