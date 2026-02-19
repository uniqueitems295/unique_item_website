import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "./ui/badge";

export const categories = [
    {
        title: "Men Watches",
        image:
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/shop?category=men",
    },
    {
        title: "Women Watches",
        image:
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/shop?category=women",
    },
    {
        title: "Couples Watches",
        image: "https://tmactwfrm3mqjwv9.public.blob.vercel-storage.com/coupleswatch",
        href: "/shop?category=couplewatches",
    },
    {
        title: "Sport Watches",
        image:
            "https://images.unsplash.com/photo-1691439378545-dd6b35ff2f7b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/shop?category=sport",
    },
];

export default function HomeCategories() {
    return (
        <section className="w-full md:pt-10">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <div className="mb-10 md:mb-14 space-y-4 text-center">
                    <Badge variant="secondary" className="rounded-full px-4 py-1">
                        Categories
                    </Badge>
                    <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                        Shop by Category
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-zinc-600 sm:text-base">
                        Find the perfect watch for every style, age, and occasion.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {categories.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group overflow-hidden rounded-xl transition "
                        >
                            <div className="relative h-56 w-full overflow-hidden rounded-xl md:h-96">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="py-4 md:py-7">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-base font-semibold text-zinc-900">
                                        {cat.title}
                                    </h3>

                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-zinc-900 transition group-hover:bg-zinc-900 group-hover:text-white">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </div>

                                <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-zinc-200">
                                    <div className="h-full w-0 bg-zinc-900 transition-all duration-500 group-hover:w-full" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
