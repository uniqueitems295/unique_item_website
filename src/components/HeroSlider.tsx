"use client";

import * as React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const banners = [
    {
        id: 1,
        desktopImage: "/images/hero/banner1.png",
        mobileImage: "/images/hero/mobile-banner1.png",
        alt: "Luxury Watch Banner 1",
    },
    {
        id: 2,
        desktopImage: "/images/hero/banner1.png",
        mobileImage: "/images/hero/mobile-banner1.png",
        alt: "Luxury Watch Banner 2",
    },
    {
        id: 3,
        desktopImage: "/images/hero/banner1.png",
        mobileImage: "/images/hero/mobile-banner1.png",
        alt: "Luxury Watch Banner 3",
    },
];

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-[#0B0C0E] select-none group">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                pagination={{
                    clickable: true,
                    el: ".hero-custom-pagination",
                    bulletClass: "hero-custom-bullet",
                    bulletActiveClass: "hero-custom-bullet-active",
                }}
                navigation={{
                    prevEl: ".hero-prev-btn",
                    nextEl: ".hero-next-btn",
                }}
                className="w-full h-auto"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative w-full">
                        <div className="relative w-full hidden md:block">
                            <Image
                                src={banner.desktopImage}
                                alt={banner.alt}
                                width={1920}
                                height={1080}
                                priority
                                sizes="100vw"
                                className="w-full h-auto object-contain block"
                            />
                        </div>
                        <div className="relative w-full block md:hidden">
                            <Image
                                src={banner.mobileImage}
                                alt={banner.alt}
                                width={768}
                                height={1024}
                                priority
                                sizes="100vw"
                                className="w-full h-auto object-contain block"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                type="button"
                aria-label="Previous slide"
                className="hero-prev-btn absolute left-4 sm:left-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#EDEAE2]/20 bg-[#0B0C0E]/50 text-[#EDEAE2] backdrop-blur-md transition-all duration-300 hover:border-[#C9A15C] hover:text-[#C9A15C] hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
                type="button"
                aria-label="Next slide"
                className="hero-next-btn absolute right-4 sm:right-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#EDEAE2]/20 bg-[#0B0C0E]/50 text-[#EDEAE2] backdrop-blur-md transition-all duration-300 hover:border-[#C9A15C] hover:text-[#C9A15C] hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2 hero-custom-pagination" />

            <style jsx global>{`
                .hero-custom-bullet {
                    display: inline-block;
                    width: 20px;
                    height: 3px;
                    border-radius: 9999px;
                    background: rgba(237, 234, 226, 0.35);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .hero-custom-bullet-active {
                    background: #C9A15C;
                    width: 36px;
                }
            `}</style>
        </section>
    );
}