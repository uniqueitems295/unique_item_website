import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Truck, RefreshCcw, Gem, Watch, MessageCircle } from "lucide-react";
import UserWrapper from "@/app/(wrappers)/userWrapper";

const stats = [
    { label: "Happy Customers", value: "5,000+" },
    { label: "Watches Delivered", value: "10,000+" },
    { label: "Support Response", value: "< 24 hours" },
    { label: "Return Policy", value: "7 Days" },
];

const values = [
    {
        title: "Quality First",
        desc: "We choose watches that feel premium, look clean, and last longer—so you get real value for your money.",
        icon: ShieldCheck,
    },
    {
        title: "Modern Style",
        desc: "From classic to minimal to sport, we focus on designs that match today’s fashion and everyday wear.",
        icon: Watch,
    },
    {
        title: "Fast Nationwide Delivery",
        desc: "We deliver all over Pakistan with safe packaging and tracking so your watch arrives in perfect condition.",
        icon: Truck,
    },
    {
        title: "Easy Returns",
        desc: "If you receive a wrong or damaged product, we offer a simple return or exchange process within 7 days.",
        icon: RefreshCcw,
    },
];

const faqs = [
    {
        q: "What is Unique Items?",
        a: "Unique Items is an online watch store that offers premium-looking watches at affordable prices. We focus on quality, clean design, and customer satisfaction.",
    },
    {
        q: "Do you offer Cash on Delivery?",
        a: "Yes, Cash on Delivery is available in most cities across Pakistan. You can also choose other payment options at checkout.",
    },
    {
        q: "How can I contact support?",
        a: "You can contact us through the Contact page. Our team usually responds within 24 hours.",
    },
];

export default function AboutPage() {
    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">

                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-[-220px] top-[-220px] h-[520px] w-[520px] rounded-full bg-black/10 blur-3xl" />
                        <div className="absolute right-[-260px] bottom-[-260px] h-[560px] w-[560px] rounded-full bg-black/10 blur-3xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6 ">
                                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
                                    Our Mission
                                </Badge>

                                <h2 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
                                    Style that feels premium,
                                    <span className="block text-zinc-700">service that builds trust.</span>
                                </h2>

                                <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                                    Unique Items is focused on modern watches for men, women, and kids.
                                    We carefully choose designs that look clean and feel comfortable—then
                                    deliver them with fast shipping, secure packaging, and helpful support.
                                </p>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Goal</p>
                                        <p className="text-sm font-medium text-zinc-900">
                                            Premium look for everyone
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Promise</p>
                                        <p className="text-sm font-medium text-zinc-900">Quality over hype</p>
                                    </div>
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Experience</p>
                                        <p className="text-sm font-medium text-zinc-900">Smooth checkout</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button asChild className="h-11 rounded-xl px-6">
                                        <Link href="/collections">View Collections</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-11 rounded-xl px-6">
                                        <Link href="/contact">Talk to us</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative ">
                                <div className="relative mx-auto max-w-xl">
                                    <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-b from-black/10 to-transparent blur-2xl" />

                                    <div className="relative z-10 overflow-hidden rounded-[28px] border bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                            </div>
                                            <p className="text-xs font-medium text-zinc-600">Brand Values</p>
                                        </div>

                                        <div className="p-6 sm:p-8">
                                            <div className="space-y-4">
                                                <p className="text-sm font-semibold text-zinc-900">
                                                    What makes Unique Items different
                                                </p>
                                                <p className="text-sm leading-relaxed text-zinc-600">
                                                    We’re building a watch store that feels simple, premium, and
                                                    trustworthy. From selection to delivery, we focus on the details
                                                    customers care about.
                                                </p>

                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-2xl border bg-zinc-50 p-4">
                                                        <p className="text-xs text-zinc-500">Quality</p>
                                                        <p className="text-sm font-medium text-zinc-900">
                                                            Checked items
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl border bg-zinc-50 p-4">
                                                        <p className="text-xs text-zinc-500">Support</p>
                                                        <p className="text-sm font-medium text-zinc-900">
                                                            Quick replies
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl border bg-zinc-50 p-4">
                                                        <p className="text-xs text-zinc-500">Delivery</p>
                                                        <p className="text-sm font-medium text-zinc-900">
                                                            Safe packaging
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        Nationwide Shipping
                                                    </span>
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        COD Available
                                                    </span>
                                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                        Easy Returns
                                                    </span>
                                                </div>

                                                <Button asChild className="h-11 w-full rounded-xl">
                                                    <Link href="/shop">Explore Our Watches</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full border bg-white/50 backdrop-blur" />
                                    <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full border bg-white/50 backdrop-blur" />
                                </div>
                            </div>


                        </div>
                    </div>
                </section>


                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <Badge variant="secondary" className="rounded-full px-4 py-1">
                                    About Unique Items
                                </Badge>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                    Built for watch lovers who want style and value
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                    We started Unique Items with one simple goal: provide clean,
                                    premium-looking watches with reliable service and an easy online
                                    shopping experience.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button asChild className="rounded-xl">
                                    <Link href="/shop">Shop Watches</Link>
                                </Button>
                                <Button asChild variant="outline" className="rounded-xl">
                                    <Link href="/contact">Contact Us</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((s) => (
                                <Card key={s.label} className="rounded-2xl">
                                    <CardContent className="p-6">
                                        <p className="text-3xl font-semibold tracking-tight text-zinc-900">
                                            {s.value}
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-600">{s.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                What we stand for
                            </h2>
                            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                Our values guide everything—from choosing products to supporting customers.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map((v) => (
                                <Card key={v.title} className="rounded-2xl">
                                    <CardContent className="p-6">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                                            <v.icon className="h-5 w-5" />
                                        </div>
                                        <p className="mt-4 text-base font-semibold text-zinc-900">
                                            {v.title}
                                        </p>
                                        <p className="mt-2 text-sm text-zinc-600">{v.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                            <div className="rounded-3xl border bg-zinc-50 p-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                                        <Gem className="h-5 w-5" />
                                    </div>
                                    <p className="text-lg font-semibold text-zinc-900">
                                        Our promise
                                    </p>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                                    We focus on delivering watches that look great and feel reliable.
                                    Every order is packed carefully, shipped quickly, and supported
                                    by our team. If something goes wrong, we work with you to make it right.
                                </p>

                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Quality</p>
                                        <p className="text-sm font-medium text-zinc-900">
                                            Checked before dispatch
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Shipping</p>
                                        <p className="text-sm font-medium text-zinc-900">
                                            Safe packaging + tracking
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border bg-white p-4">
                                        <p className="text-xs text-zinc-500">Support</p>
                                        <p className="text-sm font-medium text-zinc-900">
                                            Helpful & responsive
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-white p-8">
                                <p className="text-sm font-semibold text-zinc-900">
                                    Our story
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                                    Unique Items started as a small idea: make it easy to find
                                    stylish watches online without overpaying. Over time, we
                                    improved our collection, focused on customer feedback, and
                                    built a store people can trust.
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                                    Today, we continue to add new designs, improve delivery, and
                                    provide a smooth shopping experience for customers across Pakistan.
                                </p>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild className="rounded-xl">
                                        <Link href="/shop">Explore Shop</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-xl">
                                        <Link href="/collections">View Collections</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Quick answers
                            </h2>
                            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                                Common questions customers ask about Unique Items.
                            </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {faqs.map((f) => (
                                <Card key={f.q} className="rounded-2xl">
                                    <CardContent className="p-6">
                                        <p className="text-base font-semibold text-zinc-900">{f.q}</p>
                                        <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-center">
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/contact" className="inline-flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Need help? Contact us
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    );
}
