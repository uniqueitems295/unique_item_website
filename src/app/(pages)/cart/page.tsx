"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"

type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    qty: number
}

function readCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem("cart")
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed
    } catch {
        return []
    }
}

function writeCart(items: CartItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(items))
}

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `₨ ${v.toLocaleString("en-PK")}`
}

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
}

export default function CartPage() {
    const [items, setItems] = React.useState<CartItem[]>([])

    React.useEffect(() => {
        setItems(readCart())
    }, [])

    const subtotal = React.useMemo(() => {
        return items.reduce((sum, i) => sum + i.price * i.qty, 0)
    }, [items])

    const updateQty = (id: string, delta: number) => {
        setItems((prev) => {
            const next = prev
                .map((i) => (i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) } : i))
                .filter((i) => i.qty > 0)
            writeCart(next)
            return next
        })
    }

    const removeItem = (id: string) => {
        setItems((prev) => {
            const next = prev.filter((i) => i.id !== id)
            writeCart(next)
            return next
        })
        toast("Removed from cart.")
    }

    const clearCart = () => {
        setItems([])
        writeCart([])
        toast("Cart cleared.")
    }

    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-7xl px-4 py-14">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                            Shopping Cart
                        </h1>

                        {items.length > 0 && (
                            <Button variant="outline" className="rounded-xl" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        )}
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-6">
                            {items.map((item) => (
                                <Card key={item.id} className="rounded-2xl">
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-50">
                                            <Image
                                                src={safeImage(item.imageUrl)}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                    className="font-medium text-zinc-900 hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    Qty: {item.qty}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQty(item.id, -1)}
                                                    >
                                                        −
                                                    </Button>
                                                    <span className="w-6 text-center text-sm">{item.qty}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQty(item.id, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <p className="text-sm font-semibold text-zinc-900">
                                                        {formatPKR(item.price * item.qty)}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {items.length === 0 && (
                                <div className="rounded-3xl border bg-zinc-50 p-10 text-center">
                                    <p className="text-lg font-semibold text-zinc-900">Your cart is empty</p>
                                    <p className="mt-2 text-sm text-zinc-600">Add some products from the shop.</p>
                                    <Button asChild className="mt-5 rounded-xl">
                                        <Link href="/shop">Go to Shop</Link>
                                    </Button>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="ghost" asChild>
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        </div>

                        <Card className="h-fit rounded-2xl">
                            <CardContent className="p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-zinc-900">Order Summary</h2>

                                <div className="flex justify-between text-sm text-zinc-600">
                                    <span>Subtotal</span>
                                    <span>{formatPKR(subtotal)}</span>
                                </div>

                                {/* <div className="flex justify-between text-sm text-zinc-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div> */}

                                <div className="border-t pt-4 flex justify-between font-semibold text-zinc-900">
                                    <span>Total</span>
                                    <span>{formatPKR(subtotal)}</span>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full h-11 rounded-xl" disabled={items.length === 0}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <p className="text-center mt-4 text-xs text-zinc-500">
                                    Secure checkout • COD available
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </UserWrapper>
    )
}
