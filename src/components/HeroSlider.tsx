"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

type Slide = {
    id: string;
    bg: string;
    title: string;
    subtitle: string;
    desc: string;
    image: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    align?: "left" | "right";
};

const slides: Slide[] = [
    {
        id: "s1",
        bg: "/images/hero/hero-bg-1.png",
        title: "Premium Watches",
        subtitle: "Timeless Style. Everyday Confidence.",
        desc: "Explore premium watches designed for comfort, durability, and a clean modern look.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2hzfGVufDB8fDB8fHww",
        ctaPrimary: { label: "Shop Now", href: "/shop" },
        ctaSecondary: { label: "View Collections", href: "/collections" },
        align: "left",
    },
    {
        id: "s2",
        bg: "/images/hero/hero-bg-2.png",
        title: "Minimal. Modern. Bold.",
        subtitle: "A watch that matches your vibe.",
        desc: "Choose from classic leather, stainless steel, and sporty designs—made for every moment.",
        image: "https://images.unsplash.com/photo-1630512731371-a3747ab932ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY2fHx8ZW58MHx8fHx8",
        ctaPrimary: { label: "Explore New", href: "/new" },
        ctaSecondary: { label: "Best Sellers", href: "/best-sellers" },
        align: "left",
    },
    {
        id: "s3",
        bg: "/images/hero/hero-bg-3.png",
        title: "Built To Last",
        subtitle: "Premium look. Reliable performance.",
        desc: "Quality materials and a refined finish—perfect for gifting or upgrading your daily style.",
        image: "https://images.unsplash.com/photo-1634140704051-58a787556cd1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzOXx8fGVufDB8fHx8fA%3D%3D",
        ctaPrimary: { label: "Shop Gifts", href: "/gifts" },
        ctaSecondary: { label: "Learn More", href: "/about" },
        align: "left",
    },
];

export default function HeroSlider() {
    const AUTOPLAY_DELAY = 8000;
    const [api, setApi] = React.useState<CarouselApi | null>(null);

    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, AUTOPLAY_DELAY);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <section className="relative w-full">
            <Carousel setApi={setApi}
                opts={{
                    loop: true,
                    align: "start",
                }} className="w-full transition-transform duration-700 ease-in-out">
                <CarouselContent>
                    {slides.map((s) => (
                        <CarouselItem key={s.id} className="p-0">
                            <div className="relative px-4 min-h-[100vh] w-full overflow-hidden">
                                <div className="absolute inset-0 -z-10">
                                    <Image
                                        src={s.bg}
                                        alt=""
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/75" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                                </div>

                                <div className="mx-auto flex min-h-[100vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
                                    <div className="grid w-full items-center gap-10 lg:grid-cols-2">
                                        <div className="space-y-5">
                                            <p className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur">
                                                {s.title}
                                            </p>

                                            <h1 className="text-4xl font-semibold tracking-tight leading-tight text-white sm:text-5xl lg:text-6xl">
                                                {s.subtitle}
                                            </h1>

                                            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                                                {s.desc}
                                            </p>

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                <Button asChild className="h-11 hover:text-white rounded-xl px-6">
                                                    <Link href={s.ctaPrimary.href}>{s.ctaPrimary.label}</Link>
                                                </Button>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="h-11 hover:text-white rounded-xl border-white/30 bg-white/10 px-6 text-white hover:bg-white/15"
                                                >
                                                    <Link href={s.ctaSecondary.href}>{s.ctaSecondary.label}</Link>
                                                </Button>
                                            </div>

                                            <div className="mt-6 md:grid hidden gap-3 sm:grid-cols-3">
                                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                                                    <p className="text-xs text-white/70">Fast Delivery</p>
                                                    <p className="text-sm font-medium text-white">
                                                        Nationwide shipping
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                                                    <p className="text-xs text-white/70">Secure Checkout</p>
                                                    <p className="text-sm font-medium text-white">
                                                        Trusted payments
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                                                    <p className="text-xs text-white/70">Easy Returns</p>
                                                    <p className="text-sm font-medium text-white">
                                                        7-day policy
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative md:block hidden mx-auto w-full max-w-[520px]">
                                            <div className="absolute -inset-6 rounded-[32px] bg-white/10 blur-2xl" />
                                            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur px-6">
                                                <div className="relative mx-auto aspect-square w-full w-full">
                                                    <Image
                                                        src={s.image}
                                                        alt="Watch"
                                                        width={500}
                                                        height={500}
                                                        className="object-cover rounded-xl w-full h-full drop-shadow-2xl"
                                                    />
                                                </div>

                                                <div className="mt-6 flex items-center justify-between gap-3">
                                                    <p className="text-sm text-white/80">
                                                        Premium watches • Clean design
                                                    </p>
                                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                                                        New Season
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-4 top-1/2 md:inline-flex hidden -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/15" />
                <CarouselNext className="right-4 top-1/2 md:inline-flex hidden -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/15" />
            </Carousel>
        </section>
    );
}
