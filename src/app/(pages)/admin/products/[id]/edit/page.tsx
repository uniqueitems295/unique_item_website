"use client"

import Link from "next/link"
import axios from "axios"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
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
import { ArrowLeft, Upload as UploadIcon, X } from "lucide-react"

type Status = "published" | "draft"

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
    status: Status
    inStock: boolean
}

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const id = params?.id

    const fileRef = useRef<HTMLInputElement | null>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [images, setImages] = useState<string[]>([])
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

    const coverImage = useMemo(() => images?.[0] || "", [images])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/admin/products/${id}`)
            const p: Product = res.data.product

            setFormData({
                name: p.name || "",
                price: String(p.price ?? ""),
                oldPrice: p.oldPrice === null || p.oldPrice === undefined ? "" : String(p.oldPrice),
                category: p.category || "",
                collection: p.collection || "",
                description: p.description || "",
                status: p.status || "published",
                inStock: Boolean(p.inStock),
            })

            setImages(Array.isArray(p.images) ? p.images : [])
            setColors(Array.isArray(p.colors) ? p.colors : [])
        } catch (e: any) {
            alert(e?.response?.data?.message || "Failed to load product")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handlePickImage = () => {
        fileRef.current?.click()
    }

    const handleUploadImage = async (file: File) => {
        try {
            setUploading(true)
            const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`
            const blob = await upload(uniqueName, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
            })
            setImages((prev) => [...prev, blob.url])
        } catch (e: any) {
            alert(e?.message || "Image upload failed")
        } finally {
            setUploading(false)
            if (fileRef.current) fileRef.current.value = ""
        }
    }

    const removeImageAt = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        if (fileRef.current) fileRef.current.value = ""
    }

    const normalizeColor = (c: string) => c.trim().toLowerCase()

    const addColor = () => {
        const v = normalizeColor(colorInput)
        if (!v) return
        setColors((prev) => (prev.includes(v) ? prev : [...prev, v]))
        setColorInput("")
    }

    const removeColor = (c: string) => {
        setColors((prev) => prev.filter((x) => x !== c))
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            if (!formData.name.trim()) {
                alert("Product name is required")
                return
            }

            await axios.patch(`/api/admin/products/${id}`, {
                name: formData.name,
                price: Number(formData.price),
                oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                category: formData.category,
                collection: formData.collection,
                description: formData.description,
                images,
                colors,
                status: formData.status,
                inStock: formData.inStock,
            })

            alert("Product updated successfully ✅")
            router.push("/admin/products")
        } catch (e: any) {
            alert(e?.response?.data?.message || "Failed to update product")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>
            </div>
        )
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
                                Edit Product
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                Update your product details.
                            </p>
                        </div>

                        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                            <Link href="/admin/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} className="h-11" />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (PKR)</Label>
                                        <Input
                                            id="price"
                                            type="number"
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
                                                <SelectItem value="women">Women Watches</SelectItem>
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
                                            placeholder='Type a color and press "Add" (e.g., black)'
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
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Product Images</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleUploadImage(file)
                                        }}
                                    />

                                    <div className="relative flex h-40 items-center justify-center rounded-2xl border border-dashed bg-zinc-50 overflow-hidden">
                                        {coverImage ? (
                                            <>
                                                <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                                                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs text-zinc-800">
                                                    Cover (first image)
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageAt(0)}
                                                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2"
                                                    aria-label="Remove cover image"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <UploadIcon className="mx-auto h-6 w-6 text-zinc-500" />
                                                <p className="mt-2 text-sm text-zinc-600">Upload product images</p>
                                                <p className="text-xs text-zinc-500">
                                                    The first image is used as the cover in your UI.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {images.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-zinc-600">
                                                Uploaded Images ({images.length}) — first one is the cover
                                            </p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {images.map((url, idx) => (
                                                    <div
                                                        key={`${url}-${idx}`}
                                                        className="relative overflow-hidden rounded-xl border bg-white"
                                                    >
                                                        <img src={url} alt={`Image ${idx + 1}`} className="h-20 w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImageAt(idx)}
                                                            className="absolute right-1 top-1 rounded-full bg-white/90 p-1.5"
                                                            aria-label="Remove image"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                        {idx === 0 && (
                                                            <div className="absolute left-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-zinc-800">
                                                                Cover
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-xl"
                                        onClick={handlePickImage}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "Add Image"}
                                    </Button>
                                </CardContent>
                            </Card>

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
                                        onClick={handleSave}
                                        disabled={saving || uploading}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
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
