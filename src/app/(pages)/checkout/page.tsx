"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Truck, Wallet } from "lucide-react"
import UserWrapper from "@/app/(wrappers)/userWrapper"

type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    qty: number
}

type PaymentMethod = "cod" | "online"

type CheckoutForm = {
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    city: string
    postal: string
    paymentMethod: PaymentMethod
}

type CheckoutStorage = {
    form: CheckoutForm
    cart: CartItem[]
    subtotal: number
    shipping: number
    total: number
    createdAt: string
}

const SHIPPING_FEE = 200

function safeImage(url?: string) {
    return url?.trim() ? url : "/images/placeholder.png"
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

function formatPKR(n: number) {
    const v = Number.isFinite(n) ? n : 0
    return `₨ ${v.toLocaleString("en-PK")}`
}

function readCheckoutForm(): CheckoutForm {
    if (typeof window === "undefined") {
        return {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            postal: "",
            paymentMethod: "cod",
        }
    }

    try {
        const raw = localStorage.getItem("checkout_form")
        if (!raw) {
            return {
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                postal: "",
                paymentMethod: "cod",
            }
        }
        const parsed = JSON.parse(raw)
        return {
            firstName: String(parsed.firstName || ""),
            lastName: String(parsed.lastName || ""),
            phone: String(parsed.phone || ""),
            email: String(parsed.email || ""),
            address: String(parsed.address || ""),
            city: String(parsed.city || ""),
            postal: String(parsed.postal || ""),
            paymentMethod: parsed.paymentMethod === "online" ? "online" : "cod",
        }
    } catch {
        return {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            postal: "",
            paymentMethod: "cod",
        }
    }
}

function writeCheckoutForm(form: CheckoutForm) {
    if (typeof window === "undefined") return
    localStorage.setItem("checkout_form", JSON.stringify(form))
}

function writeCheckoutData(data: CheckoutStorage) {
    if (typeof window === "undefined") return
    localStorage.setItem("checkout_data", JSON.stringify(data))
}

export default function CheckoutPage() {
    const [form, setForm] = React.useState<CheckoutForm>(() => readCheckoutForm())
    const [cart, setCart] = React.useState<CartItem[]>([])
    const [placing, setPlacing] = React.useState(false)

    React.useEffect(() => {
        setCart(readCart())
    }, [])

    React.useEffect(() => {
        writeCheckoutForm(form)
    }, [form])

    const subtotal = React.useMemo(() => {
        return cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    }, [cart])

    const total = subtotal + (cart.length ? SHIPPING_FEE : 0)

    const update = (key: keyof CheckoutForm, value: string | PaymentMethod) => {
        setForm((p) => ({ ...p, [key]: value as any }))
    }

    const validate = () => {
        if (!form.firstName.trim()) return "First name is required"
        if (!form.lastName.trim()) return "Last name is required"
        if (!form.phone.trim()) return "Phone number is required"
        if (!form.address.trim()) return "Address is required"
        if (!form.city.trim()) return "City is required"
        if (cart.length === 0) return "Your cart is empty"
        return ""
    }

    const placeOrder = async () => {
        const msg = validate()
        if (msg) {
            toast(msg)
            return
        }

        try {
            setPlacing(true)

            const payload: CheckoutStorage = {
                form,
                cart,
                subtotal,
                shipping: SHIPPING_FEE,
                total,
                createdAt: new Date().toISOString(),
            }

            writeCheckoutData(payload)
            toast("Order saved. Proceeding...")

            window.location.href = "/payment-confirmation"
        } finally {
            setPlacing(false)
        }
    }

    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <Badge variant="secondary" className="rounded-full px-4 py-1">
                            Checkout
                        </Badge>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                            Complete your order
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                            Enter your shipping details and confirm your payment method. Cash on Delivery (COD) is available.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <Truck className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Fast Delivery</p>
                                    <p className="text-xs text-zinc-600">2–5 working days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <Wallet className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">COD Available</p>
                                    <p className="text-xs text-zinc-600">Pay at your doorstep</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <ShieldCheck className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Secure Checkout</p>
                                    <p className="text-xs text-zinc-600">Safe packaging</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Shipping Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={form.firstName}
                                                onChange={(e) => update("firstName", e.target.value)}
                                                placeholder="Muhammad"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={form.lastName}
                                                onChange={(e) => update("lastName", e.target.value)}
                                                placeholder="Talha"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={form.phone}
                                                onChange={(e) => update("phone", e.target.value)}
                                                placeholder="+92 3xx xxx xxxx"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="email">Email (optional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => update("email", e.target.value)}
                                                placeholder="you@email.com"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Full Address</Label>
                                            <Textarea
                                                id="address"
                                                value={form.address}
                                                onChange={(e) => update("address", e.target.value)}
                                                placeholder="House no, street, area..."
                                                className="min-h-[110px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={form.city}
                                                onChange={(e) => update("city", e.target.value)}
                                                placeholder="Karachi"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postal">Postal Code (optional)</Label>
                                            <Input
                                                id="postal"
                                                value={form.postal}
                                                onChange={(e) => update("postal", e.target.value)}
                                                placeholder="75500"
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-zinc-900">Payment Method</p>
                                        <RadioGroup
                                            value={form.paymentMethod}
                                            onValueChange={(v) => update("paymentMethod", v as PaymentMethod)}
                                            className="grid gap-3"
                                        >
                                            <label className="flex cursor-pointer items-center justify-between rounded-2xl border p-4">
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="cod" id="cod" />
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900">Cash on Delivery</p>
                                                        <p className="text-xs text-zinc-600">Pay when you receive the order</p>
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                    Recommended
                                                </span>
                                            </label>

                                            <label className="flex cursor-pointer items-center justify-between rounded-2xl border p-4 opacity-70">
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="online" id="online" />
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900">Online Payment</p>
                                                        <p className="text-xs text-zinc-600">Card / Bank transfer (Coming soon)</p>
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                    Soon
                                                </span>
                                            </label>
                                        </RadioGroup>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="rounded-2xl">
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-50">
                                                    <Image src={safeImage(item.imageUrl)} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                                                    <p className="text-xs text-zinc-600">Qty: {item.qty}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-zinc-900">
                                                    {formatPKR(item.price * item.qty)}
                                                </p>
                                            </div>
                                        ))}

                                        <div className="border-t pt-4 space-y-2 text-sm text-zinc-700">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>{formatPKR(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span>{cart.length ? formatPKR(SHIPPING_FEE) : formatPKR(0)}</span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-zinc-900">Total</span>
                                            <span className="text-lg font-semibold text-zinc-900">{formatPKR(total)}</span>
                                        </div>

                                        <Button className="h-11 w-full rounded-xl" onClick={placeOrder} disabled={placing || cart.length === 0}>
                                            {placing ? "Placing..." : "Place Order"}
                                        </Button>

                                        <Button asChild variant="outline" className="h-11 mt-3 w-full rounded-xl">
                                            <Link href="/cart">Back to Cart</Link>
                                        </Button>

                                        <p className="text-center text-xs text-zinc-500">
                                            By placing your order, you agree to our terms and privacy policy.
                                        </p>
                                    </CardContent>
                                </Card>

                                <div className="rounded-2xl border bg-zinc-50 p-5">
                                    <p className="text-sm font-semibold text-zinc-900">Need help?</p>
                                    <p className="mt-1 text-sm text-zinc-600">Contact us for order updates or product questions.</p>
                                    <div className="mt-4 flex gap-2">
                                        <Button asChild variant="outline" className="rounded-xl">
                                            <Link href="/contact">Contact</Link>
                                        </Button>
                                        <Button asChild className="rounded-xl">
                                            <Link href="/shop">Shop More</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    )
}
