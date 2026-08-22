"use client"

import Link from "next/link"
import axios from "axios"
import { useMemo, useRef, useState } from "react"
import { upload } from "@vercel/blob/client"
import imageCompression from "browser-image-compression"
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
import { toast } from "sonner"

type Status = "published" | "draft"

const MAX_IMAGE_BYTES = 3 * 1024 * 1024
const MAX_DIMENSION = 2400
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

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
    if (/^[a-z]+$/.test(trimmed)) return trimmed
    return null
}

function prettySize(bytes: number) {
    if (!Number.isFinite(bytes)) return "-"
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
    return `${Math.round(bytes / 1024)}KB`
}

export default function AddNewProductPage() {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const videoRef = useRef<HTMLInputElement | null>(null)

    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)

    const [images, setImages] = useState<string[]>([])
    const [imageError, setImageError] = useState<string | null>(null)

    const [videos, setVideos] = useState<string[]>([])
    const [videoUploading, setVideoUploading] = useState(false)
    const [videoUploadProgress, setVideoUploadProgress] = useState<{ done: number; total: number } | null>(null)
    const [videoError, setVideoError] = useState<string | null>(null)

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

    const resetFileInput = () => {
        if (fileRef.current) fileRef.current.value = ""
    }

    const resetVideoInput = () => {
        if (videoRef.current) videoRef.current.value = ""
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handlePickImage = () => {
        fileRef.current?.click()
    }

    const removeImageAt = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setImageError(null)
        resetFileInput()
    }

    const compressIfNeeded = async (file: File): Promise<File> => {
        if (file.size <= MAX_IMAGE_BYTES) return file

        const compressed = (await imageCompression(file, {
            maxSizeMB: MAX_IMAGE_BYTES / (1024 * 1024),
            maxWidthOrHeight: MAX_DIMENSION,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.8,
        })) as File

        return compressed
    }

    const uploadSingleFile = async (file: File): Promise<string | null> => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast(`"${file.name}" skipped — only JPG, PNG, WEBP allowed.`)
            return null
        }

        const compressed = await compressIfNeeded(file)

        if (compressed.size > MAX_IMAGE_BYTES) {
            toast(`"${file.name}" is still too large after compression. Skipped.`)
            return null
        }

        const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}.webp`
        const blob = await upload(uniqueName, compressed, {
            access: "public",
            handleUploadUrl: "/api/upload",
        })
        return blob.url
    }

    const handleUploadImages = async (files: FileList) => {
        if (!files.length) return
        setImageError(null)
        setUploading(true)
        setUploadProgress({ done: 0, total: files.length })

        try {
            const fileArray = Array.from(files)
            let done = 0

            const results = await Promise.all(
                fileArray.map(async (file) => {
                    const url = await uploadSingleFile(file)
                    done++
                    setUploadProgress({ done, total: fileArray.length })
                    return url
                })
            )

            const uploaded = results.filter(Boolean) as string[]
            if (uploaded.length > 0) {
                setImages((prev) => [...prev, ...uploaded])
                toast(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded ✅`)
            }
        } catch (e: any) {
            const msg = e?.message || "Image upload failed"
            setImageError(msg)
            toast(msg)
        } finally {
            setUploading(false)
            setUploadProgress(null)
            resetFileInput()
        }
    }

    const handlePickVideo = () => {
        videoRef.current?.click()
    }

    const removeVideoAt = (index: number) => {
        setVideos((prev) => prev.filter((_, i) => i !== index))
        setVideoError(null)
        resetVideoInput()
    }

    const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
    const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50 MB

    const uploadSingleVideo = async (file: File): Promise<string | null> => {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            toast(`"${file.name}" skipped — only MP4, WEBM, MOV allowed.`)
            return null
        }
        if (file.size > MAX_VIDEO_BYTES) {
            toast(`"${file.name}" is too large (max 50 MB). Skipped.`)
            return null
        }
        const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`
        const blob = await upload(uniqueName, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
        })
        return blob.url
    }

    const handleUploadVideos = async (files: FileList) => {
        if (!files.length) return
        setVideoError(null)
        setVideoUploading(true)
        setVideoUploadProgress({ done: 0, total: files.length })

        try {
            const fileArray = Array.from(files)
            let done = 0

            const results = await Promise.all(
                fileArray.map(async (file) => {
                    const url = await uploadSingleVideo(file)
                    done++
                    setVideoUploadProgress({ done, total: fileArray.length })
                    return url
                })
            )

            const uploaded = results.filter(Boolean) as string[]
            if (uploaded.length > 0) {
                setVideos((prev) => [...prev, ...uploaded])
                toast(`${uploaded.length} video${uploaded.length > 1 ? "s" : ""} uploaded ✅`)
            }
        } catch (e: any) {
            const msg = e?.message || "Video upload failed"
            setVideoError(msg)
            toast(msg)
        } finally {
            setVideoUploading(false)
            setVideoUploadProgress(null)
            resetVideoInput()
        }
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
            setImageError(null)
            setVideoError(null)
            setUploadProgress(null)
            setVideoUploadProgress(null)
            resetFileInput()
            resetVideoInput()
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

                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Slug (auto-generated)</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900">
                                        {formData.name ? slugify(formData.name) : "-"}
                                    </p>
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
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.length) handleUploadImages(e.target.files)
                                        }}
                                    />

                                    <div
                                        className={
                                            "relative flex h-40 items-center justify-center rounded-2xl border border-dashed bg-zinc-50 overflow-hidden " +
                                            (imageError ? "border-red-500" : "")
                                        }
                                    >
                                        {coverImage ? (
                                            <>
                                                <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                                                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs text-zinc-800">
                                                    Cover (first image)
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <UploadIcon className="mx-auto h-6 w-6 text-zinc-500" />
                                                <p className="mt-2 text-sm text-zinc-600">Upload product images</p>
                                                <p className="text-xs text-zinc-500">
                                                    The first uploaded image will be used as the cover in your UI.
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
                                                    <div key={`${url}-${idx}`} className="relative overflow-hidden rounded-xl border bg-white">
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

                                    {uploadProgress && (
                                        <div className="rounded-xl border bg-white px-4 py-3 text-sm text-zinc-700">
                                            Uploading {uploadProgress.done} / {uploadProgress.total}...
                                        </div>
                                    )}

                                    {imageError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {imageError}
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-xl"
                                        onClick={handlePickImage}
                                        disabled={uploading}
                                    >
                                        {uploading
                                            ? uploadProgress
                                                ? `Uploading ${uploadProgress.done}/${uploadProgress.total}...`
                                                : "Uploading..."
                                            : "Add Images"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* ---- Video Upload Card ---- */}
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Product Videos</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <input
                                        ref={videoRef}
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.length) handleUploadVideos(e.target.files)
                                        }}
                                    />

                                    {videos.length === 0 && !videoUploading && (
                                        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed bg-zinc-50">
                                            <div className="text-center">
                                                <p className="text-sm text-zinc-600">No videos uploaded yet</p>
                                                <p className="text-xs text-zinc-500 mt-1">MP4, WEBM, MOV · max 50 MB each</p>
                                            </div>
                                        </div>
                                    )}

                                    {videos.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-zinc-600">
                                                Uploaded Videos ({videos.length})
                                            </p>
                                            <div className="space-y-2">
                                                {videos.map((url, idx) => (
                                                    <div key={`${url}-${idx}`} className="relative overflow-hidden rounded-xl border bg-zinc-50">
                                                        <video
                                                            src={url}
                                                            controls
                                                            className="w-full max-h-48 object-contain bg-black"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVideoAt(idx)}
                                                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow"
                                                            aria-label="Remove video"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                        <div className="px-3 py-1.5 text-xs text-zinc-500">
                                                            Video {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {videoUploadProgress && (
                                        <div className="rounded-xl border bg-white px-4 py-3 text-sm text-zinc-700">
                                            Uploading {videoUploadProgress.done} / {videoUploadProgress.total}...
                                        </div>
                                    )}

                                    {videoError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {videoError}
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-xl"
                                        onClick={handlePickVideo}
                                        disabled={videoUploading}
                                    >
                                        {videoUploading
                                            ? videoUploadProgress
                                                ? `Uploading ${videoUploadProgress.done}/${videoUploadProgress.total}...`
                                                : "Uploading..."
                                            : "Add Videos"}
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
                                        onClick={handleSubmit}
                                        disabled={loading || uploading || videoUploading}
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
