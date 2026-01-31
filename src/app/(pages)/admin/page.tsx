"use client"

import * as React from "react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Package,
    ShoppingBag,
    Users,
    TrendingUp,
    Plus,
    ArrowRight,
    Clock,
    Truck,
    AlertCircle,
    MessageCircle,
    RefreshCcw,
} from "lucide-react"
import { useRouter } from "next/navigation"

type OrderStatus =
    | "pending_verification"
    | "processing"
    | "dispatched"
    | "delivered"
    | "cancelled"
    | "rejected"

type DashboardOrder = {
    _id: string
    form: {
        firstName: string
        lastName: string
    }
    total: number
    status: OrderStatus
    createdAt: string
}

type DashboardStats = {
    totalOrders: number
    totalProducts: number
    totalCustomers: number
    revenue: number
    productsOutOfStock: number
    pendingOrders: number
    dispatchedToday: number
    recentOrders: DashboardOrder[]
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

function statusPill(status: OrderStatus) {
    if (status === "delivered") return { label: "Delivered", cls: "bg-green-100 text-green-700" }
    if (status === "dispatched") return { label: "Dispatched", cls: "bg-blue-100 text-blue-700" }
    if (status === "processing") return { label: "Processing", cls: "bg-amber-100 text-amber-700" }
    if (status === "cancelled" || status === "rejected") return { label: status === "cancelled" ? "Cancelled" : "Rejected", cls: "bg-red-100 text-red-700" }
    return { label: "Pending", cls: "bg-zinc-100 text-zinc-700" }
}

export default function AdminDashboardPage() {
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState<DashboardStats | null>(null)

    const fetchDashboard = async () => {
        try {
            setLoading(true)
            const res = await axios.get("/api/admin/dashboard")
            setData(res.data?.data || null)
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to load dashboard")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchDashboard()
    }, [])

    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.post("/api/admin/logout")

            toast("Logged out successfully")

            router.replace("/login")
        } catch (err: any) {
            toast(err?.response?.data?.message || "Logout failed")
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 py-1">
                                Admin Dashboard
                            </Badge>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Unique Items Admin
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                Manage products, track orders, and monitor store performance.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button asChild className="h-11 rounded-xl px-5">
                                <Link href="/admin/products/new" className="inline-flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                                <Link href="/admin/orders" className="inline-flex items-center gap-2">
                                    View Orders <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button onClick={handleLogout} variant="destructive" className="h-11 rounded-xl px-5">
                                Logout
                            </Button>
                            <Button variant="outline" className="h-11 rounded-xl px-5" onClick={fetchDashboard}>
                                <RefreshCcw />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Spinner />
                        </div>
                    ) : !data ? (
                        <div className="rounded-2xl border bg-zinc-50 p-10 text-center">
                            <p className="text-lg font-semibold text-zinc-900">No dashboard data</p>
                            <p className="mt-2 text-sm text-zinc-600">Try refresh.</p>
                            <Button className="mt-5 rounded-xl" onClick={fetchDashboard}>
                                Refresh
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                                <Card className="rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-zinc-700">Total Orders</CardTitle>
                                        <ShoppingBag className="h-4 w-4 text-zinc-900" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-zinc-900">{data.totalOrders}</div>
                                        <p className="mt-1 text-xs text-zinc-500">All time</p>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-zinc-700">Products</CardTitle>
                                        <Package className="h-4 w-4 text-zinc-900" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-zinc-900">{data.totalProducts}</div>
                                        <p className="mt-1 text-xs text-zinc-500">{data.productsOutOfStock} out of stock</p>
                                    </CardContent>
                                </Card>

                                {/* <Card className="rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-zinc-700">Customers</CardTitle>
                                        <Users className="h-4 w-4 text-zinc-900" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-zinc-900">{data.totalCustomers}</div>
                                        <p className="mt-1 text-xs text-zinc-500">All time</p>
                                    </CardContent>
                                </Card> */}

                                <Card className="rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-zinc-700">Revenue</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-zinc-900" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold text-zinc-900">{formatPKR(data.revenue)}</div>
                                        <p className="mt-1 text-xs text-zinc-500">Calculated from orders</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                                <Card className="rounded-2xl lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Recent Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {data.recentOrders.map((o) => {
                                            const name = `${o.form.firstName} ${o.form.lastName}`.trim()
                                            const pill = statusPill(o.status)
                                            return (
                                                <div
                                                    key={o._id}
                                                    className="flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-zinc-900">{name || "—"}</p>
                                                        <p className="text-xs text-zinc-500">{formatDate(o.createdAt)}</p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className={"rounded-full px-3 py-1 text-xs font-medium " + pill.cls}>
                                                            {pill.label}
                                                        </span>
                                                        <p className="text-sm font-semibold text-zinc-900">{formatPKR(o.total)}</p>
                                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                                            <Link href={`/admin/orders/${o._id}`}>View</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {data.recentOrders.length === 0 && (
                                            <div className="rounded-2xl border bg-zinc-50 p-8 text-center">
                                                <p className="text-sm font-semibold text-zinc-900">No recent orders</p>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <Button asChild variant="outline" className="rounded-xl">
                                                <Link href="/admin/orders" className="inline-flex items-center gap-2">
                                                    View All Orders <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button asChild className="h-11 w-full rounded-xl">
                                                <Link href="/admin/products/new" className="inline-flex items-center gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    Add New Product
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                                                <Link href="/admin/products" className="inline-flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Manage Products
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                                                <Link href="/admin/orders" className="inline-flex items-center gap-2">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Manage Orders
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                                                <Link href="/admin/contacts" className="inline-flex items-center gap-2">
                                                    <MessageCircle className="h-4 w-4" />
                                                    Contact Messages
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Store Alerts</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                                                <AlertCircle className="mt-0.5 h-4 w-4 text-zinc-900" />
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900">Stock running low</p>
                                                    <p className="text-sm text-zinc-600">
                                                        {data.productsOutOfStock} products are out of stock.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                                                <Clock className="mt-0.5 h-4 w-4 text-zinc-900" />
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900">Pending orders</p>
                                                    <p className="text-sm text-zinc-600">
                                                        {data.pendingOrders} orders need confirmation.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                                                <Truck className="mt-0.5 h-4 w-4 text-zinc-900" />
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900">Dispatched today</p>
                                                    <p className="text-sm text-zinc-600">
                                                        {data.dispatchedToday} orders marked as dispatched today.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
