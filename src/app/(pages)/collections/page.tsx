import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import UserWrapper from "@/app/(wrappers)/userWrapper";
import { categories } from "@/components/HomeCategories";

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
            </div>
        </UserWrapper>
    );
}
