import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Truck, Phone } from "lucide-react"

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen py-10 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <Card className="rounded-3xl">
                    <CardContent className="p-8 sm:p-12 sm:py-6 text-center space-y-8">
                        <div className="flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Order Placed Successfully!
                            </h1>
                            <p className="text-zinc-600 text-base sm:text-lg">
                                Thank you for shopping with <span className="font-medium">Unique Items</span>.
                                Your order has been received and is being processed.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border bg-zinc-50 p-4">
                                <Truck className="mx-auto h-5 w-5 text-zinc-900" />
                                <p className="mt-2 text-sm font-medium text-zinc-900">
                                    Fast Delivery
                                </p>
                                <p className="text-xs text-zinc-600">
                                    2–5 working days
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-zinc-50 p-4">
                                <CheckCircle className="mx-auto h-5 w-5 text-zinc-900" />
                                <p className="mt-2 text-sm font-medium text-zinc-900">
                                    Order Confirmed
                                </p>
                                <p className="text-xs text-zinc-600">
                                    Processing started
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-zinc-50 p-4">
                                <Phone className="mx-auto h-5 w-5 text-zinc-900" />
                                <p className="mt-2 text-sm font-medium text-zinc-900">
                                    Need Help?
                                </p>
                                <p className="text-xs text-zinc-600">
                                    Support available
                                </p>
                            </div>
                        </div>

                        {/* <div className="rounded-2xl border bg-zinc-50 p-5 text-left space-y-3">
                            <p className="text-sm font-semibold text-zinc-900">
                                What happens next?
                            </p>
                            <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1">
                                <li>Our team will confirm your order via phone or message.</li>
                                <li>Your watch will be carefully packed and dispatched.</li>
                                <li>You’ll receive delivery within 2–5 working days.</li>
                            </ul>
                        </div> */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button asChild className="h-11 rounded-xl px-6">
                                <Link href="/shop">Continue Shopping</Link>
                            </Button>

                            <Button asChild variant="outline" className="h-11 rounded-xl px-6">
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>

                        <p className="text-xs text-zinc-500">
                            Order reference and details will be shared via phone or email.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
