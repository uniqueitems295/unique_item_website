"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Phone, Clock, ShieldCheck } from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"
import { Spinner } from "@/components/ui/spinner"
import type { OrderDoc } from "@/lib/types/order"

type CheckoutStorage = {
    form: OrderDoc["form"]
    cart: OrderDoc["items"]
    subtotal: number
    shipping: number
    total: number
    createdAt: string
}

function readCheckoutData(): CheckoutStorage | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem("checkout_data")
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return parsed
    } catch {
        return null
    }
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

export default function PaymentConfirmationPage() {
    const ADVANCE_AMOUNT = 250
    const ADVANCE_CURRENCY = "Rs "

    const [file, setFile] = React.useState<File | null>(null)
    const [preview, setPreview] = React.useState<string>("")
    const [submitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (!file) {
            setPreview("")
            return
        }
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    const RECEIVER = {
        name: "MUHAMMAD KHURRAM SHEIKH",
        easypaisa: "*********4593",
        accountLabel: "Unique Items",
    }

    const handleSubmit = async () => {
        const checkout = readCheckoutData()
        if (!checkout) {
            toast("Checkout data not found. Please go back to checkout.")
            return
        }
        if (!file) {
            toast("Please upload payment screenshot.")
            return
        }

        try {
            setSubmitting(true)

            const ext = file.name.split(".").pop() || "jpg"
            const blob = await upload(`payment-proof-${Date.now()}.${ext}`, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
            })

            const payload: Partial<OrderDoc> = {
                form: checkout.form,
                items: checkout.cart,
                subtotal: checkout.subtotal,
                shipping: checkout.shipping,
                total: checkout.total,
                paymentProofUrl: blob.url,
                receiver: {
                    name: RECEIVER.name,
                    easypaisaMsisdn: RECEIVER.easypaisa,
                },
            }

            const res = await axios.post("/api/orders", payload)

            localStorage.removeItem("cart")
            toast("Payment proof submitted. Order is under verification.")
            window.location.href = `/order-success?orderId=${res.data?.orderId || ""}`
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to submit payment proof")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-6xl px-4 py-12">
                        <Badge variant="secondary" className="rounded-full px-4 py-1">
                            Payment Required
                        </Badge>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                            Complete Your Payment
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                            Please pay the advance amount and upload the screenshot. Our team will verify and confirm your order.
                        </p>

                        <div className="mt-6 rounded-2xl border bg-white p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">Advance Payment Required</p>
                                    <p className="mt-1 text-2xl font-semibold text-zinc-900">
                                        {ADVANCE_CURRENCY}
                                        {ADVANCE_AMOUNT}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-600">
                                        Send exactly {ADVANCE_CURRENCY}
                                        {ADVANCE_AMOUNT} before we can process your order.
                                    </p>
                                </div>
                                <Badge className="rounded-full px-3 py-1">Required</Badge>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Scan & Pay (QR Code)</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-4">
                                    <div className="relative h-56 w-56 overflow-hidden rounded-xl border bg-white">
                                        <Image
                                            src="/qrcode.jpeg"
                                            alt="Payment QR Code"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-zinc-600 text-center">
                                        Scan with EasyPaisa / JazzCash and pay {ADVANCE_CURRENCY}
                                        {ADVANCE_AMOUNT} advance, then upload the screenshot on the right side.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Manual Transfer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-xl border bg-zinc-50 p-4">
                                        <p className="text-xs text-zinc-500">Amount to Send</p>
                                        <p className="text-sm font-semibold text-zinc-900">
                                            {ADVANCE_CURRENCY}
                                            {ADVANCE_AMOUNT} (Advance Payment)
                                        </p>
                                        <p className="text-xs text-zinc-600">Please send the exact amount.</p>
                                    </div>

                                    <div className="rounded-xl border bg-zinc-50 p-4">
                                        <p className="text-xs text-zinc-500">Receiver Name</p>
                                        <p className="text-sm font-semibold text-zinc-900">{RECEIVER.name}</p>
                                    </div>

                                    <div className="rounded-xl border bg-zinc-50 p-4">
                                        <p className="text-xs text-zinc-500">EasyPaisa</p>
                                        <p className="text-sm font-semibold text-zinc-900">{RECEIVER.easypaisa}</p>
                                        <p className="text-xs text-zinc-600">Account: {RECEIVER.accountLabel}</p>
                                    </div>

                                    <p className="text-xs text-zinc-500">
                                        After sending {ADVANCE_CURRENCY}
                                        {ADVANCE_AMOUNT}, upload your payment screenshot to confirm your order.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Upload Payment Proof</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="rounded-2xl border bg-zinc-50 p-4">
                                        <p className="text-xs text-zinc-500">Required Advance</p>
                                        <p className="text-lg font-semibold text-zinc-900">
                                            {ADVANCE_CURRENCY}
                                            {ADVANCE_AMOUNT}
                                        </p>
                                        <p className="text-xs text-zinc-600">
                                            Upload the screenshot showing {ADVANCE_CURRENCY}
                                            {ADVANCE_AMOUNT} payment.
                                        </p>
                                    </div>

                                    <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-zinc-50 text-center">
                                        <Upload className="h-6 w-6 text-zinc-500" />
                                        <p className="mt-2 text-sm text-zinc-600">Upload screenshot of payment</p>
                                        <p className="text-xs text-zinc-500">JPG, PNG up to 5MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>

                                    {preview && (
                                        <div className="rounded-2xl border bg-white p-3">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-50">
                                                <Image src={preview} alt="Proof preview" fill className="object-contain" />
                                            </div>
                                        </div>
                                    )}

                                    <Button className="w-full h-11 rounded-xl" onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? (
                                            <span className="inline-flex items-center gap-2">
                                                <Spinner />
                                                Submitting...
                                            </span>
                                        ) : (
                                            "Submit Payment Proof"
                                        )}
                                    </Button>

                                    <Button asChild variant="outline" className="w-full rounded-xl">
                                        <Link href="/checkout">Back to Checkout</Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl">
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-zinc-900" />
                                        <p className="text-sm text-zinc-700">
                                            Your payment will be verified manually by our team.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-zinc-900" />
                                        <p className="text-sm text-zinc-700">
                                            Order confirmation within 24 hours after verification.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-zinc-900" />
                                        <p className="text-sm text-zinc-700">
                                            Need help? Our support team will contact you shortly.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    )
}
