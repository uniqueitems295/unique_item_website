"use client"

import { useRef, useState } from "react"
import { upload } from "@vercel/blob/client"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload as UploadIcon, Image as ImageIcon, Video as VideoIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 5 * 1024 * 1024   // 5 MB — blob storage limit
const MAX_DIMENSION = 2400
const MAX_VIDEO_BYTES = 50 * 1024 * 1024  // 50 MB

// All accepted image MIME types (HEIC may arrive as empty string on iOS)
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/avif",
    "image/svg+xml",
    "image/heic",
    "image/heif",
    "image/heic-sequence",
    "image/heif-sequence",
]


const ALLOWED_IMAGE_EXTENSIONS = [
    ".jpg", ".jpeg", ".png", ".webp", ".gif",
    ".bmp", ".tiff", ".tif", ".avif", ".svg",
    ".heic", ".heif",
]

function isAllowedImage(file: File): boolean {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) return true
    // Fallback: check extension (useful for HEIC on some devices)
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    return ALLOWED_IMAGE_EXTENSIONS.includes(ext)
}

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileJob {
    id: string
    name: string
    originalSize: number
    compressedSize?: number
    status: "queued" | "compressing" | "uploading" | "done" | "error"
    url?: string
    error?: string
}

interface MediaUploaderProps {
    images: string[]
    videos: string[]
    onImagesChange: (images: string[]) => void
    onVideosChange: (videos: string[]) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prettySize(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "-"
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${Math.round(bytes / 1024)} KB`
}

function uid() {
    return Math.random().toString(36).slice(2, 10)
}

// ─── Compression logic ────────────────────────────────────────────────────────

async function compressImage(file: File): Promise<{ file: File; compressed: boolean }> {
    if (!isAllowedImage(file)) {
        throw new Error(`"${file.name}" is not a supported image format. Allowed: JPG, PNG, WEBP, HEIC, GIF, BMP, TIFF, AVIF, SVG.`)
    }
    if (file.size <= MAX_IMAGE_BYTES) {
        return { file, compressed: false }
    }
    const result = (await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_BYTES / (1024 * 1024),
        maxWidthOrHeight: MAX_DIMENSION,
        useWebWorker: true,
        fileType: "image/webp",  // always convert to WebP on upload
        initialQuality: 0.82,
    })) as File
    if (result.size > MAX_IMAGE_BYTES) {
        throw new Error(`"${file.name}" is still too large after compression.`)
    }
    return { file: result, compressed: true }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaUploader({ images, videos, onImagesChange, onVideosChange }: MediaUploaderProps) {
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const videoInputRef = useRef<HTMLInputElement | null>(null)

    const [imageJobs, setImageJobs] = useState<FileJob[]>([])
    const [videoJobs, setVideoJobs] = useState<FileJob[]>([])

    // ── Image Upload ─────────────────────────────────────────────────────────

    const updateImageJob = (id: string, patch: Partial<FileJob>) =>
        setImageJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)))

    const handleImageFiles = async (files: FileList) => {
        if (!files.length) return

        const newJobs: FileJob[] = Array.from(files).map((f) => ({
            id: uid(),
            name: f.name,
            originalSize: f.size,
            status: "queued",
        }))

        setImageJobs((prev) => [...prev, ...newJobs])

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const job = newJobs[i]

            try {
                // Step 1 – Compress
                updateImageJob(job.id, { status: "compressing" })
                const { file: compressed, compressed: wasCompressed } = await compressImage(file)
                updateImageJob(job.id, { compressedSize: compressed.size })

                if (wasCompressed) {
                    toast(`Compressed: ${prettySize(file.size)} → ${prettySize(compressed.size)}`)
                }

                // Step 2 – Upload
                updateImageJob(job.id, { status: "uploading" })
                const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}.webp`
                const blob = await upload(uniqueName, compressed, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                })

                updateImageJob(job.id, { status: "done", url: blob.url })
                onImagesChange([...images, blob.url])
                toast(`"${file.name}" uploaded`)
            } catch (err: any) {
                const msg = err?.message || "Upload failed"
                updateImageJob(job.id, { status: "error", error: msg })
                toast(msg)
            }
        }

        if (imageInputRef.current) imageInputRef.current.value = ""
    }

    // ── Video Upload ─────────────────────────────────────────────────────────

    const updateVideoJob = (id: string, patch: Partial<FileJob>) =>
        setVideoJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)))

    const handleVideoFiles = async (files: FileList) => {
        if (!files.length) return

        const newJobs: FileJob[] = Array.from(files).map((f) => ({
            id: uid(),
            name: f.name,
            originalSize: f.size,
            status: "queued",
        }))

        setVideoJobs((prev) => [...prev, ...newJobs])

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const job = newJobs[i]

            try {
                if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
                    throw new Error(`Only MP4, WEBM, MOV allowed. "${file.name}" skipped.`)
                }
                if (file.size > MAX_VIDEO_BYTES) {
                    throw new Error(`"${file.name}" is too large (max 50 MB).`)
                }

                // Videos are uploaded as-is (browser video compression is not currently supported)
                updateVideoJob(job.id, { status: "uploading" })
                const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`
                const blob = await upload(uniqueName, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                })

                updateVideoJob(job.id, { status: "done", url: blob.url })
                onVideosChange([...videos, blob.url])
                toast(`"${file.name}" uploaded`)
            } catch (err: any) {
                const msg = err?.message || "Upload failed"
                updateVideoJob(job.id, { status: "error", error: msg })
                toast(msg)
            }
        }

        if (videoInputRef.current) videoInputRef.current.value = ""
    }

    // ── Remove helpers ───────────────────────────────────────────────────────

    const removeImage = (url: string) => {
        onImagesChange(images.filter((u) => u !== url))
    }

    const removeVideo = (url: string) => {
        onVideosChange(videos.filter((u) => u !== url))
    }

    const clearImageJob = (id: string) => setImageJobs((prev) => prev.filter((j) => j.id !== id))
    const clearVideoJob = (id: string) => setVideoJobs((prev) => prev.filter((j) => j.id !== id))

    const anyImageBusy = imageJobs.some((j) => j.status === "compressing" || j.status === "uploading")
    const anyVideoBusy = videoJobs.some((j) => j.status === "uploading")

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* ── Image Card ─────────────────────────────────────────────────── */}
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        Product Images
                        <span className="ml-auto text-xs font-normal text-zinc-500">
                            Auto-compressed · JPG / PNG / WEBP / HEIC / GIF / BMP
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/avif,image/svg+xml,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.avif,.svg"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.length) handleImageFiles(e.target.files) }}
                    />

                    {/* Drop zone / cover preview */}
                    <div
                        className="relative flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-zinc-400 hover:bg-zinc-100"
                        onClick={() => !anyImageBusy && imageInputRef.current?.click()}
                    >
                        {images[0] ? (
                            <>
                                <img src={images[0]} alt="Cover" className="h-full w-full object-cover" />
                                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow">
                                    Cover image
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <UploadIcon className="mx-auto h-7 w-7 text-zinc-400" />
                                <p className="mt-2 text-sm font-medium text-zinc-600">Click to upload images</p>
                                <p className="mt-1 text-xs text-zinc-400">Large images are auto-compressed before upload</p>
                            </div>
                        )}
                    </div>

                    {/* Uploaded previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((url, idx) => (
                                <div key={`${url}-${idx}`} className="group relative overflow-hidden rounded-xl border bg-white">
                                    <img src={url} alt={`Image ${idx + 1}`} className="h-20 w-full object-cover" />
                                    {idx === 0 && (
                                        <div className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-zinc-700">
                                            Cover
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(url)}
                                        className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow transition group-hover:opacity-100"
                                        aria-label="Remove image"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Job progress rows */}
                    {imageJobs.length > 0 && (
                        <div className="space-y-2">
                            {imageJobs.map((job) => (
                                <JobRow key={job.id} job={job} onDismiss={() => clearImageJob(job.id)} type="image" />
                            ))}
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={anyImageBusy}
                    >
                        {anyImageBusy ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                        ) : (
                            <><UploadIcon className="mr-2 h-4 w-4" /> Add Images</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* ── Video Card ─────────────────────────────────────────────────── */}
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <VideoIcon className="h-4 w-4 text-zinc-500" />
                        Product Videos
                        <span className="ml-auto text-xs font-normal text-zinc-500">
                            MP4 / WEBM / MOV · max 50 MB
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.length) handleVideoFiles(e.target.files) }}
                    />

                    {videos.length === 0 && !anyVideoBusy && (
                        <div
                            className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-zinc-400 hover:bg-zinc-100"
                            onClick={() => videoInputRef.current?.click()}
                        >
                            <div className="text-center">
                                <VideoIcon className="mx-auto h-6 w-6 text-zinc-400" />
                                <p className="mt-2 text-sm text-zinc-600">Click to upload videos</p>
                                <p className="mt-1 text-xs text-zinc-400">MP4, WEBM, MOV · max 50 MB each</p>
                            </div>
                        </div>
                    )}

                    {/* Uploaded video previews */}
                    {videos.length > 0 && (
                        <div className="space-y-2">
                            {videos.map((url, idx) => (
                                <div key={`${url}-${idx}`} className="relative overflow-hidden rounded-xl border bg-zinc-50">
                                    <video src={url} controls className="w-full max-h-48 object-contain bg-black" />
                                    <button
                                        type="button"
                                        onClick={() => removeVideo(url)}
                                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow"
                                        aria-label="Remove video"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="px-3 py-1.5 text-xs text-zinc-500">Video {idx + 1}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Job progress rows */}
                    {videoJobs.length > 0 && (
                        <div className="space-y-2">
                            {videoJobs.map((job) => (
                                <JobRow key={job.id} job={job} onDismiss={() => clearVideoJob(job.id)} type="video" />
                            ))}
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={anyVideoBusy}
                    >
                        {anyVideoBusy ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</>
                        ) : (
                            <><UploadIcon className="mr-2 h-4 w-4" /> Add Videos</>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

// ─── JobRow sub-component ─────────────────────────────────────────────────────

function JobRow({
    job,
    onDismiss,
    type,
}: {
    job: FileJob
    onDismiss: () => void
    type: "image" | "video"
}) {
    const statusLabel: Record<FileJob["status"], string> = {
        queued: "Queued…",
        compressing: "Compressing…",
        uploading: "Uploading…",
        done: "Done",
        error: "Error",
    }

    const isActive = job.status === "compressing" || job.status === "uploading"
    const isDone = job.status === "done"
    const isError = job.status === "error"

    return (
        <div
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                isDone
                    ? "border-green-200 bg-green-50"
                    : isError
                    ? "border-red-200 bg-red-50"
                    : "border-zinc-200 bg-white"
            }`}
        >
            <span className="shrink-0">
                {isActive && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                {isDone && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {isError && <AlertCircle className="h-4 w-4 text-red-500" />}
                {job.status === "queued" && <Loader2 className="h-4 w-4 text-zinc-400" />}
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-800">{job.name}</p>
                <p className="text-xs text-zinc-500">
                    {isError && job.error}
                    {!isError && (
                        <>
                            {statusLabel[job.status]}
                            {type === "image" && isDone && job.compressedSize && job.compressedSize < job.originalSize && (
                                <span className="ml-1 text-green-600">
                                    · {prettySize(job.originalSize)} → {prettySize(job.compressedSize)} saved
                                </span>
                            )}
                            {!job.compressedSize && ` · ${prettySize(job.originalSize)}`}
                        </>
                    )}
                </p>
            </div>

            {(isDone || isError) && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 rounded-full p-1 hover:bg-zinc-100"
                    aria-label="Dismiss"
                >
                    <X className="h-3.5 w-3.5 text-zinc-400" />
                </button>
            )}
        </div>
    )
}
