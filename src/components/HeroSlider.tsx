"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";

export default function Hero() {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = React.useState(true);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            video.pause();
            return;
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { });
        }
    }, []);

    const toggleSound = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setMuted(video.muted);
    };

    return (
        <section className="relative h-[87vh] min-h-[640px] w-full overflow-hidden bg-[#0B0C0E]">
            <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"
                    }`}
                src="https://tmactwfrm3mqjwv9.public.blob.vercel-storage.com/herobg.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setReady(true)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/20 via-[#0B0C0E]/35 to-[#0B0C0E]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/20 via-transparent to-[#0B0C0E]/30" />

            <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-34 text-center sm:px-8">


                <h1
                    className="max-w-3xl text-[#EDEAE2]"
                    style={{
                        fontFamily: "var(--font-display, serif)",
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                    }}
                >
                    Time, held to a{" "}
                    <span className="italic text-[#C9A15C]">higher standard.</span>
                </h1>

                <p className="mt-6 max-w-md tracking-wide leading-relaxed text-[#fff]/90">
                    Machined from surgical-grade steel, driven by a hand finished
                    automatic movement built to outlast the decade.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-2 border border-[#C9A15C] bg-[#C9A15C] px-7 py-3.5 text-sm font-medium text-[#0B0C0E] transition-colors hover:bg-transparent hover:text-[#C9A15C]"
                    >
                        View all watches
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 border border-[#EDEAE2]/30 px-7 py-3.5 text-sm font-medium text-[#EDEAE2] transition-colors hover:border-[#EDEAE2]"
                    >
                        The craft behind it
                    </Link>
                </div>
            </div>

            <button
                type="button"
                onClick={toggleSound}
                aria-label={muted ? "Unmute background video" : "Mute background video"}
                className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#EDEAE2]/25 bg-[#0B0C0E]/50 text-[#EDEAE2] backdrop-blur-sm transition-colors hover:border-[#C9A15C] hover:text-[#C9A15C]"
            >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/20 via-[#0B0C0E]/35 to-[#0B0C0E]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/20 via-transparent to-[#0B0C0E]/30" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/70 to-transparent" />
        </section>
    );
}