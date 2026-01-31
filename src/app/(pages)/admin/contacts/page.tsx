"use client"

import * as React from "react"
import axios from "axios"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreVertical, Eye, CheckCircle2, Trash2 } from "lucide-react"

type ContactStatus = "new" | "replied"

type ContactMessage = {
    _id: string
    firstName: string
    lastName: string
    email: string
    whatsapp: string
    subject: string
    message: string
    status: ContactStatus
    createdAt: string
}

function formatDate(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function statusPill(status: ContactStatus) {
    if (status === "replied") return "bg-green-100 text-green-700"
    return "bg-amber-100 text-amber-700"
}

export default function AdminContactsPage() {
    const [loading, setLoading] = React.useState(true)
    const [items, setItems] = React.useState<ContactMessage[]>([])
    const [query, setQuery] = React.useState("")
    const [status, setStatus] = React.useState<"all" | ContactStatus>("all")

    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState<ContactMessage | null>(null)

    const fetchMessages = React.useCallback(async (q?: string, s?: string) => {
        try {
            setLoading(true)
            const res = await axios.get("/api/contact", {
                params: {
                    q: q ?? query,
                    status: s ?? status,
                },
            })
            setItems(res.data?.messages || [])
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to load contact messages")
        } finally {
            setLoading(false)
        }
    }, [query, status])

    React.useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    React.useEffect(() => {
        const t = setTimeout(() => fetchMessages(query, status), 350)
        return () => clearTimeout(t)
    }, [query, status, fetchMessages])

    const openView = (m: ContactMessage) => {
        setActive(m)
        setOpen(true)
    }

    const markReplied = async (id: string) => {
        try {
            await axios.patch(`/api/contact/${id}`, { status: "replied" })
            toast("Marked as replied.")
            setItems((prev) => prev.map((x) => (x._id === id ? { ...x, status: "replied" } : x)))
            if (active?._id === id) setActive({ ...active, status: "replied" })
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to update status")
        }
    }

    const deleteMessage = async (id: string) => {
        const ok = window.confirm("Delete this message?")
        if (!ok) return
        try {
            await axios.delete(`/api/contact/${id}`)
            toast("Deleted.")
            setItems((prev) => prev.filter((x) => x._id !== id))
            if (active?._id === id) {
                setOpen(false)
                setActive(null)
            }
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to delete message")
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="border-b bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full px-4 py-1">
                                Contact
                            </Badge>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Contact Messages
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                View and manage customer inquiries.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="h-11 rounded-xl" onClick={() => fetchMessages()}>
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
                                placeholder="Search name / email / subject..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("all")}>
                                All
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("new")}>
                                New
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("replied")}>
                                Replied
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card className="rounded-2xl">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">Messages</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="hidden md:grid grid-cols-[1.2fr_1.3fr_1fr_1.4fr_0.8fr_48px] gap-4 px-6 py-4 text-xs font-semibold text-zinc-600">
                                <span>Customer</span>
                                <span>Email</span>
                                <span>Whatsapp</span>
                                <span>Subject</span>
                                <span>Status</span>
                                <span className="text-right">Action</span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Spinner />
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {items.map((m) => {
                                        const name = `${m.firstName} ${m.lastName}`.trim()
                                        return (
                                            <div
                                                key={m._id}
                                                className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[1.2fr_1.3fr_1fr_1.4fr_0.8fr_48px] md:items-center"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900">{name || "—"}</p>
                                                    <p className="text-xs text-zinc-500">{formatDate(m.createdAt)}</p>
                                                </div>

                                                <div className="text-sm text-zinc-700">{m.email || "—"}</div>
                                                <div className="text-sm text-zinc-700">{m.whatsapp || "—"}</div>
                                                <div className="text-sm text-zinc-900 line-clamp-1">{m.subject || "—"}</div>

                                                <div>
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusPill(m.status)}`}>
                                                        {m.status === "replied" ? "Replied" : "New"}
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
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openView(m)}>
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2"
                                                                onClick={() => markReplied(m._id)}
                                                                disabled={m.status === "replied"}
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Mark as Replied
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => deleteMessage(m._id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {items.length === 0 && (
                                        <div className="py-16 text-center">
                                            <p className="text-lg font-semibold text-zinc-900">No messages found</p>
                                            <p className="mt-2 text-sm text-zinc-600">Try changing filters or search.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>Message Details</DialogTitle>
                    </DialogHeader>

                    {active && (
                        <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Customer</p>
                                    <p className="text-sm font-semibold text-zinc-900">{`${active.firstName} ${active.lastName}`.trim() || "—"}</p>
                                </div>
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Date</p>
                                    <p className="text-sm font-semibold text-zinc-900">{formatDate(active.createdAt)}</p>
                                </div>
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Email</p>
                                    <p className="text-sm font-semibold text-zinc-900">{active.email || "—"}</p>
                                </div>
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Whatsapp</p>
                                    <p className="text-sm font-semibold text-zinc-900">{active.whatsapp || "—"}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <p className="text-xs text-zinc-500">Subject</p>
                                <p className="mt-1 text-sm font-semibold text-zinc-900">{active.subject || "—"}</p>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <p className="text-xs text-zinc-500">Message</p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{active.message || "—"}</p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => markReplied(active._id)}
                                    disabled={active.status === "replied"}
                                >
                                    Mark as Replied
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="rounded-xl"
                                    onClick={() => deleteMessage(active._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
