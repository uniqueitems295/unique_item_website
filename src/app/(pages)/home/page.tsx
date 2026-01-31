import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Watch, Sparkles } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import HomeCategories from "@/components/HomeCategories";
import AllWatchesSection from "@/components/AllWatchesSection";
import Faq from "@/components/Faq";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ContactUsForm from "@/components/ContactUsForm";
import UserWrapper from "@/app/(wrappers)/userWrapper";

const features = [
    {
        title: "Premium Quality",
        desc: "Carefully selected watches with a clean finish and durable build.",
        icon: ShieldCheck,
    },
    {
        title: "Fast Delivery",
        desc: "Quick shipping with safe packaging for a smooth experience.",
        icon: Truck,
    },
    {
        title: "Easy Returns",
        desc: "Hassle-free return policy to shop with confidence.",
        icon: RefreshCcw,
    },
];

const collections = [
    {
        title: "Classic Collection",
        desc: "Timeless designs for daily wear and formal looks.",
        image: "/images/collections/classic.jpg",
        href: "/collections/classic",
    },
    {
        title: "Minimal Collection",
        desc: "Simple, modern watches with a clean dial aesthetic.",
        image: "/images/collections/minimal.jpg",
        href: "/collections/minimal",
    },
    {
        title: "Sport Collection",
        desc: "Bold builds made for active days and tough use.",
        image: "/images/collections/sport.jpg",
        href: "/collections/sport",
    },
];

export default function HomePg() {
    return (
        <>
            <UserWrapper>
                <HeroSlider />

                <HomeCategories />

                <AllWatchesSection />

                <section className="relative overflow-hidden pt-12 lg:pt-24 pb-8 lg:pb-10">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/10 blur-3xl" />
                        <div className="absolute bottom-[-240px] right-[-240px] h-[520px] w-[520px] rounded-full bg-black/10 blur-3xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-22">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6">
                                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <Watch className="h-4 w-4" />
                                        Why Unique Items
                                    </span>
                                </Badge>

                                <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                                    Premium feel,
                                    <span className="block text-zinc-700">with a smooth shopping experience.</span>
                                </h2>

                                <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                                    From product selection to fast delivery, we focus on quality and service.
                                    Shop confidently with secure checkout, nationwide shipping, and support that
                                    actually helps.
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button asChild className="h-11 rounded-xl px-6">
                                        <Link href="/shop" className="inline-flex items-center gap-2">
                                            Browse All Watches <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <Button asChild variant="outline" className="h-11 rounded-xl px-6">
                                        <Link href="/contact">Contact Support</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full overflow-hidden">
                                <Image src={"https://images.unsplash.com/photo-1633599925393-a4af0a650546?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} width={700} height={700} alt="" className="w-full rounded-2xl object-cover md:h-[35rem] h-auto" />
                            </div>

                            {/* <div className="relative">
                                <div className="relative mx-auto max-w-xl">
                                    <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-b from-black/10 to-transparent blur-2xl" />
                                    <div className="relative z-10 overflow-hidden rounded-[28px] border bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                                            </div>
                                            <p className="text-xs font-medium text-zinc-600">Store Promise</p>
                                        </div>

                                        <div className="p-6 sm:p-8">
                                            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-zinc-900">Quality Checks</p>
                                                    <p className="text-xs text-zinc-600">
                                                        Carefully packed • Verified before dispatch
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                            Secure Checkout
                                                        </span>
                                                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                            Nationwide Delivery
                                                        </span>
                                                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                                                            Easy Returns
                                                        </span>
                                                    </div>

                                                    <Button asChild className="mt-3 h-10 w-full rounded-xl">
                                                        <Link href="/privacy-policy">Read Our Policy</Link>
                                                    </Button>
                                                </div>

                                                <div className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center">
                                                    <div className="absolute inset-0 rounded-full bg-zinc-100" />
                                                    <div className="absolute inset-6 rounded-full border border-zinc-200 bg-white" />
                                                    <div className="absolute inset-[56px] rounded-full border border-zinc-200 bg-zinc-50" />

                                                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-900 text-white shadow-xl">
                                                        <Watch className="h-10 w-10" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                                <div className="rounded-2xl border bg-white p-4">
                                                    <p className="text-xs text-zinc-500">Delivery</p>
                                                    <p className="text-sm font-medium text-zinc-900">2–5 Days</p>
                                                </div>
                                                <div className="rounded-2xl border bg-white p-4">
                                                    <p className="text-xs text-zinc-500">Payment</p>
                                                    <p className="text-sm font-medium text-zinc-900">COD Available</p>
                                                </div>
                                                <div className="rounded-2xl border bg-white p-4">
                                                    <p className="text-xs text-zinc-500">Returns</p>
                                                    <p className="text-sm font-medium text-zinc-900">7 Days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full border bg-white/50 backdrop-blur" />
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border bg-white/50 backdrop-blur" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </section>

                <div className="" id="faq"></div>
                <Faq />

                <Testimonials />

                <section className="relative isolate overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <Image
                            src="https://images.unsplash.com/photo-1633599925393-a4af0a650546?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Premium watches"
                            fill
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                        <div className="mx-auto max-w-3xl text-center text-white space-y-6">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
                                Limited Time Collection
                            </span>

                            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                                Elevate your style with a watch that lasts
                            </h2>

                            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                                Discover modern, premium watches crafted for everyday wear and special
                                moments. Designed to look elegant and feel comfortable.
                            </p>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 pt-4">
                                <a
                                    href="/shop"
                                    className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-zinc-900 hover:bg-white/90"
                                >
                                    Shop Watches
                                </a>

                                <a
                                    href="/collections"
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-medium text-white hover:bg-white/10"
                                >
                                    View Collections
                                </a>
                            </div>
                        </div>
                    </div>
                </section>


                <div className="w-full max-w-7xl lg:mx-auto px-4 md:pt-28 pt-16 md:pb-28 pb-16">
                    <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
                        {/* Left Content */}
                        <div className="space-y-5">
                            <span className="inline-flex w-fit items-center rounded-full bg-zinc-100 px-4 py-1 text-sm font-medium text-zinc-700">
                                Contact Us
                            </span>

                            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                                Send us a message
                            </h2>

                            <p className="max-w-md text-base leading-relaxed text-zinc-600">
                                Have a question about an order, delivery, or choosing the right watch?
                                Fill out the form and our team will get back to you as soon as possible.
                            </p>

                            <div className="space-y-3 pt-4">
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Support hours</p>
                                    <p className="text-sm font-medium text-zinc-900">
                                        Mon – Sat, 10am to 8pm
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-zinc-50 p-4">
                                    <p className="text-xs text-zinc-500">Response time</p>
                                    <p className="text-sm font-medium text-zinc-900">
                                        Usually within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Form */}
                        <Card className="border md:col-span-2 bg-white">
                            <ContactUsForm />
                        </Card>
                    </div>
                </div>


            </UserWrapper>



        </>
    );
}
