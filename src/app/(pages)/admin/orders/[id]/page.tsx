"use client"

import * as React from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Order = {
    _id: string
    form: {
        firstName: string
        lastName: string
        phone: string
        email: string
        address: string
        city: string
        postal: string
        paymentMethod: "cod" | "online"
    }
    items: {
        id: string
        slug: string
        name: string
        price: number
        imageUrl: string
        qty: number
    }[]
    subtotal: number
    shipping: number
    total: number
    paymentProofUrl: string
    receiver?: { name: string; easypaisaMsisdn: string }
    status:
    | "pending_verification"
    | "processing"
    | "dispatched"
    | "delivered"
    | "cancelled"
    | "rejected"
    createdAt: string
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `₨ ${v.toLocaleString("en-PK")}`
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

const STATUS_OPTIONS: { value: Order["status"]; label: string }[] = [
    { value: "pending_verification", label: "Pending Verification" },
    { value: "processing", label: "Processing" },
    { value: "dispatched", label: "Dispatched" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
]

export default function AdminOrderDetailsPage() {
    const params = useParams<{ id: string }>()
    const id = params?.id

    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [order, setOrder] = React.useState<Order | null>(null)
    const [status, setStatus] = React.useState<Order["status"]>("pending_verification")

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/orders/${id}`)
            const o = res.data?.order as Order
            setOrder(o)
            setStatus(o?.status || "pending_verification")
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to load order")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (!id) return
        fetchOrder()
    }, [id])

    const updateStatus = async () => {
        if (!order) return
        try {
            setSaving(true)
            await axios.patch(`/api/orders/${order._id}`, { status })
            toast("Order status updated")
            fetchOrder()
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to update status")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-zinc-900">Order not found</p>
                    <Button asChild className="mt-4 rounded-xl">
                        <Link href="/admin/orders">Back to Orders</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const customerName = `${order.form.firstName} ${order.form.lastName}`.trim()

    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 py-1">
                                Order
                            </Badge>
                            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                                {order._id}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600">
                                Customer: <span className="font-medium text-zinc-900">{customerName}</span>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button asChild variant="outline" className="h-11 rounded-xl">
                                <Link href="/admin/orders">Back</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1fr_420px]">
                    <div className="space-y-6">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Customer & Shipping</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-600">Name</span>
                                    <span className="font-medium text-zinc-900">{customerName}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-600">Phone</span>
                                    <span className="font-medium text-zinc-900">{order.form.phone}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-600">City</span>
                                    <span className="font-medium text-zinc-900">{order.form.city}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-600">Address</span>
                                    <span className="font-medium text-zinc-900 text-right">{order.form.address}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((it) => (
                                    <div key={it.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-50 border">
                                            <Image src={safeImage(it.imageUrl)} alt={it.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-zinc-900">{it.name}</p>
                                            <p className="text-xs text-zinc-600">Qty: {it.qty}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-900">
                                            {formatPKR(it.price * it.qty)}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-500">Update Status</p>
                                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button className="w-full h-11 rounded-xl" onClick={updateStatus} disabled={saving}>
                                    {saving ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Spinner />
                                            Saving...
                                        </span>
                                    ) : (
                                        "Save Status"
                                    )}
                                </Button>

                                <div className="rounded-2xl border bg-zinc-50 p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">Subtotal</span>
                                        <span className="font-medium text-zinc-900">{formatPKR(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-zinc-600">Shipping</span>
                                        <span className="font-medium text-zinc-900">{formatPKR(order.shipping)}</span>
                                    </div>
                                    <div className="flex justify-between mt-3 border-t pt-3">
                                        <span className="font-semibold text-zinc-900">Total</span>
                                        <span className="font-semibold text-zinc-900">{formatPKR(order.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>Payment Proof</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-zinc-50">
                                    <Image src={safeImage(order.paymentProofUrl)} alt="Payment Proof" fill className="object-contain" />
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl"
                                    onClick={() => window.open(order.paymentProofUrl, "_blank")}
                                >
                                    Open Proof in New Tab
                                </Button>

                                {order.receiver?.name && (
                                    <div className="rounded-xl border bg-white p-4 text-sm">
                                        <p className="text-xs text-zinc-500">Receiver</p>
                                        <p className="font-medium text-zinc-900">{order.receiver.name}</p>
                                        <p className="text-xs text-zinc-600">{order.receiver.easypaisaMsisdn}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
