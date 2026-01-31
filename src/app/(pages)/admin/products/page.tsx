"use client"

import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye } from "lucide-react"

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

type Filter = "all" | "published" | "draft" | "out"

function formatPKR(value: number) {
    const n = Number.isFinite(value) ? value : 0
    return `₨ ${n.toLocaleString("en-PK")}`
}

export default function ManageProductsPage() {
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState<Filter>("all")

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/api/admin/products")
            setProducts(res.data?.products || [])
        } catch (e: any) {
            alert(e?.response?.data?.message || "Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        return products
            .filter((p) => {
                if (filter === "published") return p.status === "published"
                if (filter === "draft") return p.status === "draft"
                if (filter === "out") return p.inStock === false
                return true
            })
            .filter((p) => {
                if (!q) return true
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.collection.toLowerCase().includes(q) ||
                    p.slug.toLowerCase().includes(q)
                )
            })
    }, [products, query, filter])

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Delete this product?")
        if (!ok) return

        try {
            setDeletingId(id)
            await axios.delete(`/api/admin/products/${id}`)
            setProducts((prev) => prev.filter((p) => p._id !== id))
        } catch (e: any) {
            alert(e?.response?.data?.message || "Failed to delete")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 py-1">
                                Products
                            </Badge>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Manage Products
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                View, edit, and organize your watch listings.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button asChild className="h-11 rounded-xl px-5">
                                <Link
                                    href="/admin/products/new"
                                    className="inline-flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                                <Link href="/admin" className="inline-flex items-center gap-2">
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                className="h-11 rounded-xl pl-9"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setFilter("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setFilter("published")}
                            >
                                Published
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setFilter("draft")}
                            >
                                Draft
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setFilter("out")}
                            >
                                Out of stock
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={fetchProducts}
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card className="rounded-2xl">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">
                                {loading ? "Loading..." : `All Products (${filtered.length})`}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="hidden md:grid grid-cols-[56px_1.5fr_0.8fr_0.7fr_0.7fr_0.6fr_48px] gap-4 px-6 py-4 text-xs font-semibold text-zinc-600">
                                <span>Image</span>
                                <span>Product</span>
                                <span>Category</span>
                                <span>Price</span>
                                <span>Stock</span>
                                <span>Status</span>
                                <span className="text-right">Action</span>
                            </div>

                            <div className="divide-y">
                                {filtered.map((p) => {
                                    const stockLabel = p.inStock ? "In Stock" : "Out of Stock"
                                    const statusLabel = p.status === "published" ? "Published" : "Draft"
                                    const img = p.imageUrl?.trim() ? p.imageUrl : "/images/placeholder.png"

                                    return (
                                        <div
                                            key={p._id}
                                            className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[56px_1.5fr_0.8fr_0.7fr_0.7fr_0.6fr_48px] md:items-center"
                                        >
                                            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-50">
                                                <Image src={img} alt={p.name} fill className="object-cover" />
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-zinc-900">{p.name}</p>
                                                <p className="text-xs text-zinc-500">ID: {p._id}</p>
                                                <div className="md:hidden flex flex-wrap gap-2 pt-2">
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        {p.category}
                                                    </span>
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        {formatPKR(p.price)}
                                                    </span>
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        {stockLabel}
                                                    </span>
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="hidden md:block text-sm text-zinc-700">
                                                {p.category}
                                            </div>

                                            <div className="hidden md:block text-sm font-semibold text-zinc-900">
                                                {formatPKR(p.price)}
                                            </div>

                                            <div className="hidden md:block">
                                                <span
                                                    className={
                                                        "inline-flex rounded-full px-3 py-1 text-xs font-medium " +
                                                        (p.inStock
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700")
                                                    }
                                                >
                                                    {stockLabel}
                                                </span>
                                            </div>

                                            <div className="hidden md:block">
                                                <span
                                                    className={
                                                        "inline-flex rounded-full px-3 py-1 text-xs font-medium " +
                                                        (p.status === "published"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-zinc-100 text-zinc-700")
                                                    }
                                                >
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/products/${p.slug}`}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/admin/products/${p._id}/edit`}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-red-600"
                                                            onClick={() => handleDelete(p._id)}
                                                            disabled={deletingId === p._id}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            {deletingId === p._id ? "Deleting..." : "Delete"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    )
                                })}

                                {!loading && filtered.length === 0 && (
                                    <div className="px-6 py-10 text-sm text-zinc-600">
                                        No products found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
