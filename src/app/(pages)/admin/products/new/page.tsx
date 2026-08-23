"use client"

import Link from "next/link"
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X } from "lucide-react"
import { toast } from "sonner"
import MediaUploader from "@/components/MediaUploader"

type Status = "published" | "draft"

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}

function normalizeColor(input: string): string | null {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return null
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(trimmed)) return trimmed
    if (/^[a-z\s]+$/.test(trimmed)) return trimmed
    return null
}

export default function AddNewProductPage() {
    const [loading, setLoading] = useState(false)

    const [images, setImages] = useState<string[]>([])
    const [videos, setVideos] = useState<string[]>([])

    const [colorInput, setColorInput] = useState("")
    const [colors, setColors] = useState<string[]>([])

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        oldPrice: "",
        category: "",
        collection: "",
        description: "",
        status: "published" as Status,
        inStock: true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const addColor = () => {
        const v = normalizeColor(colorInput)
        if (!v) return
        setColors((prev) => (prev.includes(v) ? prev : [...prev, v]))
        setColorInput("")
    }

    const removeColor = (c: string) => {
        setColors((prev) => prev.filter((x) => x !== c))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)

            if (!formData.name.trim()) {
                toast("Product name is required")
                return
            }
            if (!formData.price || Number.isNaN(Number(formData.price))) {
                toast("Price is required")
                return
            }
            if (!formData.category) {
                toast("Category is required")
                return
            }
            if (!formData.collection) {
                toast("Collection is required")
                return
            }
            if (images.length === 0 && videos.length === 0) {
                toast("Please upload at least one product image or video")
                return
            }

            const baseSlug = slugify(formData.name)
            const uniqueSlug = `${baseSlug}-${Date.now()}`

            await axios.post("/api/admin/products", {
                name: formData.name,
                slug: uniqueSlug,
                price: Number(formData.price),
                oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                category: formData.category,
                collection: formData.collection,
                description: formData.description,
                images,
                videos,
                colors,
                status: formData.status,
                inStock: formData.inStock,
            })

            toast("Product created successfully ✅")

            setFormData({
                name: "",
                price: "",
                oldPrice: "",
                category: "",
                collection: "",
                description: "",
                status: "published",
                inStock: true,
            })
            setImages([])
            setVideos([])
            setColors([])
            setColorInput("")
        } catch (error: any) {
            toast(error?.response?.data?.message || "Something went wrong ❌")
        } finally {
            setLoading(false)
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
                                Add New Product
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                Create a new watch product for your store.
                            </p>
                        </div>

                        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                            <Link href="/admin">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
                        {/* ── Left: Product Information ─────────────────────── */}
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Classic Chrono Black Dial"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="h-11"
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (PKR)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="4999"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="oldPrice">Old Price (optional)</Label>
                                        <Input
                                            id="oldPrice"
                                            type="number"
                                            placeholder="6499"
                                            value={formData.oldPrice}
                                            onChange={handleChange}
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="men">Men Watches</SelectItem>
                                                <SelectItem value="women">Exclusive Deals</SelectItem>
                                                <SelectItem value="sport">Sport Watches</SelectItem>
                                                <SelectItem value="couplewatches">Couple watches</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Collection</Label>
                                        <Select
                                            value={formData.collection}
                                            onValueChange={(v) => setFormData((p) => ({ ...p, collection: v }))}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="classic">Classic</SelectItem>
                                                <SelectItem value="minimal">Minimal</SelectItem>
                                                <SelectItem value="luxury">Luxury</SelectItem>
                                                <SelectItem value="sport">Sport</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Write product description..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Colors</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={colorInput}
                                            onChange={(e) => setColorInput(e.target.value)}
                                            placeholder='Type a color and press "Add" (e.g., light blue)'
                                            className="h-11"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addColor()
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={addColor}>
                                            Add
                                        </Button>
                                    </div>

                                    {colors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {colors.map((c) => (
                                                <Badge key={c} variant="secondary" className="rounded-full px-3 py-1">
                                                    {c}
                                                    <button
                                                        type="button"
                                                        className="ml-2 inline-flex items-center"
                                                        onClick={() => removeColor(c)}
                                                        aria-label={`Remove ${c}`}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-500">No colors added yet.</p>
                                    )}
                                </div>

                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Slug (auto-generated)</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900">
                                        {formData.name ? slugify(formData.name) : "-"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Right: Media + Status ──────────────────────────── */}
                        <div className="space-y-6">
                            <MediaUploader
                                images={images}
                                videos={videos}
                                onImagesChange={setImages}
                                onVideosChange={setVideos}
                            />

                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Product Status</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Visibility</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(v: Status) => setFormData((p) => ({ ...p, status: v }))}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Select
                                            value={formData.inStock ? "in" : "out"}
                                            onValueChange={(v) => setFormData((p) => ({ ...p, inStock: v === "in" }))}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select stock" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in">In Stock</SelectItem>
                                                <SelectItem value="out">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        type="button"
                                        className="w-full h-11 rounded-xl"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Product"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
