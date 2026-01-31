import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

export async function POST(req: Request) {
    const body = (await req.json()) as HandleUploadBody

    try {
        const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
                    tokenPayload: JSON.stringify({}),
                }
            },
            onUploadCompleted: async () => { },
        })

        return NextResponse.json(jsonResponse)
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Upload error" }, { status: 400 })
    }
}
