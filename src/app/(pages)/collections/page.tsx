import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import UserWrapper from "@/app/(wrappers)/userWrapper";

const categories = [
    {
        title: "Men Watches",
        image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/shop",
    },
    {
        title: "Women Watches",
        image: "https://images.unsplash.com/photo-1736615494527-a0f4a70f1101?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8",
        href: "/shop",
    },
    {
        title: "Sport Watches",
        image: "https://images.unsplash.com/photo-1691439378545-dd6b35ff2f7b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        href: "/shop",
    },
];

export default function CollectionsPage() {
    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                            Collections
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
                            Explore watch collections made for every style—classic, minimal, sport, and premium.
                        </p>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.title}
                                    href={cat.href}
                                    className="group overflow-hidden transition"
                                >
                                    <div className="relative h-56 rounded-lg overflow-hidden md:h-96 w-full">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover rounded-lg  transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="md:py-7 py-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-base font-semibold text-zinc-900">
                                                {cat.title}
                                            </h3>

                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-zinc-900 transition group-hover:bg-zinc-900 group-hover:text-white">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        </div>

                                        <div className="mt-4 h-[2px] w-full bg-zinc-200 overflow-hidden rounded-full">
                                            <div className="h-full w-0 bg-zinc-900 transition-all duration-500 group-hover:w-full" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    );
}
