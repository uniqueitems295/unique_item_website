"use client";

import Link from "next/link";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";

import {
    MailIcon,
    MapPinIcon,
    MessageCircle,
    PhoneIcon,
    Clock,
    ShieldCheck,
    Truck,
} from "lucide-react";
import ContactUsForm from "@/components/ContactUsForm";
import UserWrapper from "@/app/(wrappers)/userWrapper";

export default function ContactPage() {
    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                            Contact Us
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            We’re here to help — Unique Items
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
                            Questions about an order, delivery, returns, or choosing the right watch?
                            Send us a message and our team will reply as soon as possible.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <Truck className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Fast Delivery</p>
                                    <p className="text-xs text-zinc-600">Nationwide shipping</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <ShieldCheck className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Secure Checkout</p>
                                    <p className="text-xs text-zinc-600">Trusted payments</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
                                <Clock className="h-5 w-5 text-zinc-900" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Support Hours</p>
                                    <p className="text-xs text-zinc-600">Mon–Sat, 10am–8pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="mx-auto w-full max-w-7xl px-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
                            <div className="grid w-full grid-cols-1 gap-1 border bg-muted p-1 sm:grid-cols-2 lg:max-w-2xl">
                                <div className="group bg-background border p-6 transition hover:shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-foreground/5 text-foreground dark:bg-foreground/10">
                                        <MailIcon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">Email</h3>
                                    <p className="my-2.5 text-muted-foreground">
                                        For orders, returns, and general questions.
                                    </p>
                                    <Link
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                        href="mailto:support@uniqueitems.pk"
                                    >
                                        support@uniqueitems.pk
                                    </Link>
                                </div>

                                <div className="group bg-background border p-6 transition hover:shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-green-500/10 text-green-600">
                                        <FaWhatsapp className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">WhatsApp / Chat</h3>
                                    <p className="my-2.5 text-muted-foreground">
                                        Quick help for size, availability, and order updates.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                                            href="https://wa.me/923191994293"
                                            target="_blank"
                                        >
                                            <FaWhatsapp className="h-4 w-4" />
                                            0319 1994293
                                        </Link>
                                        <Link
                                            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                                            href="https://wa.me/923390134186"
                                            target="_blank"
                                        >
                                            <FaWhatsapp className="h-4 w-4" />
                                            0339 0134186
                                        </Link>
                                    </div>
                                </div>

                                <div className="group bg-background border p-6 transition hover:shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-foreground/5 text-foreground dark:bg-foreground/10">
                                        <MapPinIcon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">Store Location</h3>
                                    <p className="my-2.5 text-muted-foreground">
                                        Visit us for product queries and support.
                                    </p>
                                    <Link
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                        href="https://www.google.com/maps?q=Karachi"
                                        target="_blank"
                                    >
                                        Karachi, Pakistan
                                    </Link>
                                </div>

                                <div className="group bg-background border p-6 transition hover:shadow-md">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-blue-500/10 text-blue-600">
                                        <PhoneIcon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">Phone</h3>
                                    <p className="my-2.5 text-muted-foreground">
                                        Mon–Sat from 10am to 8pm.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted underline-offset-4 hover:underline"
                                            href="tel:03191994293"
                                        >
                                            <PhoneIcon className="h-4 w-4" />
                                            0319 1994293
                                        </Link>
                                        <Link
                                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted underline-offset-4 hover:underline"
                                            href="tel:03390134186"
                                        >
                                            <PhoneIcon className="h-4 w-4" />
                                            0339 0134186
                                        </Link>
                                    </div>
                                </div>
                            </div>


                            <div className="w-full border bg-muted p-1 lg:ml-auto">
                                <Card className="rounded-none bg-white/60 shadow-none">
                                    <CardHeader>
                                        <CardTitle>Send us a message</CardTitle>
                                        <CardDescription>
                                            Fill out the form and we’ll get back to you as soon as possible.
                                        </CardDescription>
                                    </CardHeader>

                                    <ContactUsForm />
                                </Card>
                            </div>
                        </div>

                        <div className="mt-14 overflow-hidden rounded-lg border bg-zinc-50">
                            <div className="px-6 py-5">
                                <p className="text-lg mb-1 font-medium text-zinc-900">Find us on map</p>
                                <p className="text-sm text-zinc-600">
                                    Karachi, Pakistan.
                                </p>
                            </div>
                            <div className="h-[380px] md:h-[35rem] w-full">
                                <iframe
                                    title="Unique Items Location"
                                    className="h-full w-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps?q=Karachi%20Pakistan&output=embed"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    );
}
