"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { categories } from "@/lib/categories";

export default function HomeCategories() {
    return (
        <section className="w-full bg-[#0B0C0E] py-20 md:py-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                {/* <div className="mb-14 flex flex-col gap-4 border-b border-[#1E1F21] pb-10 md:mb-20 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span
                            className="mb-4 block text-xs uppercase text-[#C9A15C]"
                            style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.3em" }}
                        >
                            Browse the collection
                        </span>
                        <h2
                            className="text-[#EDEAE2]"
                            style={{
                                fontFamily: "var(--font-display, serif)",
                                fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                                lineHeight: 1.05,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Made for every wrist.
                        </h2>
                    </div>
                    <p className="max-w-sm text-[15px] leading-relaxed text-[#9c9a92]">
                        Four collections, each built around a different way of keeping
                        time. Find the one that fits how you move.
                    </p>
                </div> */}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link href={cat.href} className="group relative block overflow-hidden">
                                <div className="relative h-72 w-full overflow-hidden sm:h-[26rem]">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/10 to-transparent transition-opacity duration-500 group-hover:from-[#0B0C0E]/90" />

                                    <span
                                        className="absolute left-6 top-6 text-[#C9A15C]"
                                        style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 12, letterSpacing: "0.15em" }}
                                    >
                                        {cat.index}
                                    </span>

                                    <span className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#EDEAE2]/25 text-[#EDEAE2] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>

                                    <div className="absolute inset-x-6 bottom-6">
                                        <h3
                                            className="text-[#EDEAE2]"
                                            style={{
                                                fontFamily: "var(--font-display, serif)",
                                                fontSize: "clamp(1.75rem, 2.5vw, 2.25rem)",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {cat.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-[#c9c7bd]">{cat.sub}</p>

                                        <div className="mt-4 h-px w-10 bg-[#C9A15C] transition-all duration-500 ease-out group-hover:w-24" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}