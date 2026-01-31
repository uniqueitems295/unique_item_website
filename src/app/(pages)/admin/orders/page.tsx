"use client"

import * as React from "react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { Search, MoreVertical, Eye, CheckCircle, Clock, XCircle, Truck } from "lucide-react"

type OrderStatus =
    | "pending_verification"
    | "processing"
    | "dispatched"
    | "delivered"
    | "cancelled"
    | "rejected"

type Order = {
    _id: string
    form: {
        firstName: string
        lastName: string
        phone: string
        paymentMethod: "cod" | "online"
    }
    total: number
    paymentProofUrl: string
    status: OrderStatus
    createdAt: string
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `₨ ${v.toLocaleString("en-PK")}`
}

function formatDate(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function statusBadge(status: OrderStatus) {
    if (status === "delivered") {
        return {
            label: "Delivered",
            className: "bg-green-100 text-green-700",
            icon: <CheckCircle className="h-3 w-3" />,
        }
    }
    if (status === "dispatched") {
        return {
            label: "Dispatched",
            className: "bg-blue-100 text-blue-700",
            icon: <Truck className="h-3 w-3" />,
        }
    }
    if (status === "processing") {
        return {
            label: "Processing",
            className: "bg-amber-100 text-amber-700",
            icon: <Clock className="h-3 w-3" />,
        }
    }
    if (status === "cancelled" || status === "rejected") {
        return {
            label: status === "cancelled" ? "Cancelled" : "Rejected",
            className: "bg-red-100 text-red-700",
            icon: <XCircle className="h-3 w-3" />,
        }
    }
    return {
        label: "Pending",
        className: "bg-zinc-100 text-zinc-700",
        icon: <Clock className="h-3 w-3" />,
    }
}

export default function ManageOrdersPage() {
    const [loading, setLoading] = React.useState(true)
    const [orders, setOrders] = React.useState<Order[]>([])
    const [query, setQuery] = React.useState("")
    const [status, setStatus] = React.useState<"all" | OrderStatus>("all")

    const fetchOrders = async (q?: string, s?: string) => {
        try {
            setLoading(true)
            const res = await axios.get("/api/orders", {
                params: {
                    q: q ?? query,
                    status: s ?? status,
                },
            })
            setOrders(res.data?.orders || [])
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchOrders()
    }, [])

    React.useEffect(() => {
        const t = setTimeout(() => {
            fetchOrders(query, status)
        }, 350)
        return () => clearTimeout(t)
    }, [query, status])

    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 py-1">
                                Orders
                            </Badge>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Manage Orders
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                View, track, and update customer orders.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="h-11 rounded-xl" onClick={() => fetchOrders()}>
                                Refresh
                            </Button>
                            <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                                <Link href="/admin">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-11 rounded-xl pl-9"
                                placeholder="Search customer / phone..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("all")}>
                                All
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setStatus("pending_verification")}
                            >
                                Pending
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("processing")}>
                                Processing
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("dispatched")}>
                                Dispatched
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("delivered")}>
                                Delivered
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("cancelled")}>
                                Cancelled
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card className="rounded-2xl">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">Orders</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.9fr_1.1fr_48px] gap-4 px-6 py-4 text-xs font-semibold text-zinc-600">
                                <span>Customer</span>
                                <span>Phone</span>
                                <span>Total</span>
                                <span>Status</span>
                                <span className="text-right">Action</span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Spinner />
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {orders.map((o) => {
                                        const s = statusBadge(o.status)
                                        const customer = `${o.form.firstName} ${o.form.lastName}`.trim()
                                        return (
                                            <div
                                                key={o._id}
                                                className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[1.4fr_1fr_0.9fr_1.1fr_48px] md:items-center"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900">{customer || "—"}</p>
                                                    <p className="text-xs text-zinc-500">{formatDate(o.createdAt)}</p>
                                                </div>

                                                <div className="text-sm text-zinc-700">{o.form.phone || "—"}</div>

                                                <div className="text-sm font-semibold text-zinc-900">
                                                    {formatPKR(o.total)}
                                                    <p className="text-xs text-zinc-500">
                                                        Payment: {o.form.paymentMethod.toUpperCase()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${s.className}`}
                                                    >
                                                        {s.icon}
                                                        {s.label}
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
                                                                    href={`/admin/orders/${o._id}`}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View Order
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2"
                                                                onClick={() => window.open(o.paymentProofUrl, "_blank")}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View Proof
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {orders.length === 0 && (
                                        <div className="py-16 text-center">
                                            <p className="text-lg font-semibold text-zinc-900">No orders found</p>
                                            <p className="mt-2 text-sm text-zinc-600">Try changing filters or search.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
