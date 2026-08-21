"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Watch } from "lucide-react";

const specs = [
    { label: "Delivery", value: "2\u20135 days" },
    { label: "Payment", value: "COD available" },
    { label: "Returns", value: "7 day window" },
];

function useLiveTime() {
    const [now, setNow] = React.useState<Date | null>(null);

    React.useEffect(() => {
        setNow(new Date());
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    return now;
}

function LiveWatch() {
    const now = useLiveTime();

    const seconds = now ? now.getSeconds() + now.getMilliseconds() / 1000 : 0;
    const minutes = now ? now.getMinutes() + seconds / 60 : 0;
    const hours = now ? (now.getHours() % 12) + minutes / 60 : 0;

    const secDeg = seconds * 6;
    const minDeg = minutes * 6;
    const hourDeg = hours * 30;

    const ticks = Array.from({ length: 60 }, (_, i) => i);

    const digital = now
        ? now.toLocaleTimeString("en-US", { hour12: false })
        : "00:00:00";

    return (
        <div>
            <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#2c2c2c,#0e0e0f_70%)] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]" />

                <div className="absolute inset-[8px] rounded-full border border-[#4a4433]/50 bg-gradient-to-br from-[#1c1c1d] via-[#0f0f10] to-[#050505]">
                    <div className="absolute inset-[3px] rounded-full border border-[#C9A15C]/25" />
                </div>

                <div className="absolute inset-[26px] rounded-full bg-[#0a0a0b] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)]">
                    <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
                        {ticks.map((i) => {
                            const isHour = i % 5 === 0;
                            const angle = (i * 6 * Math.PI) / 180;
                            const rOuter = 138;
                            const rInner = isHour ? 118 : 129;
                            const x1 = 150 + rOuter * Math.sin(angle);
                            const y1 = 150 - rOuter * Math.cos(angle);
                            const x2 = 150 + rInner * Math.sin(angle);
                            const y2 = 150 - rInner * Math.cos(angle);
                            return (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={isHour ? "#C9A15C" : "#5c5a52"}
                                    strokeWidth={isHour ? 2.2 : 1}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        <text
                            x="150"
                            y="100"
                            textAnchor="middle"
                            className="fill-[#EDEAE2]"
                            style={{ fontFamily: "var(--font-display, serif)", fontSize: 14, letterSpacing: 3 }}
                        >
                            Unique Items
                        </text>

                        <g style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "150px 150px" }}>
                            <rect x="147" y="82" width="6" height="72" rx="3" fill="#EDEAE2" />
                        </g>
                        <g style={{ transform: `rotate(${minDeg}deg)`, transformOrigin: "150px 150px" }}>
                            <rect x="147.5" y="54" width="5" height="100" rx="2.5" fill="#EDEAE2" />
                        </g>
                        <g style={{ transform: `rotate(${secDeg}deg)`, transformOrigin: "150px 150px" }}>
                            <line x1="150" y1="170" x2="150" y2="46" stroke="#C9A15C" strokeWidth="1.6" />
                            <circle cx="150" cy="170" r="5" fill="#C9A15C" />
                        </g>

                        <circle cx="150" cy="150" r="5" fill="#EDEAE2" />
                        <circle cx="150" cy="150" r="2" fill="#0a0a0b" />
                    </svg>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#1E1F21] pt-4">
                <span
                    className="text-[#5f5d56]"
                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.15em" }}
                >
                    LOCAL TIME
                </span>
                <span
                    className="tabular-nums text-[#C9A15C]"
                    style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 15, letterSpacing: "0.05em" }}
                    suppressHydrationWarning
                >
                    {digital}
                </span>
            </div>
        </div>
    );
}

export default function WhyUs() {
    return (
        <section className="relative overflow-hidden bg-[#0B0C0E] py-20 md:py-28">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #C9A15C 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <Watch className="h-4 w-4 text-[#C9A15C]" />
                            <span
                                className="text-xs uppercase text-[#C9A15C]"
                                style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.25em" }}
                            >
                                Why Unique Items
                            </span>
                        </div>

                        <h2
                            className="max-w-lg text-[#EDEAE2]"
                            style={{
                                fontFamily: "var(--font-display, serif)",
                                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                                lineHeight: 1.08,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Premium feel, from checkout to your wrist.
                        </h2>

                        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#9c9a92]">
                            Every order is checked, packed, and shipped with the same
                            care we'd want for our own watch. Secure checkout, nationwide
                            delivery, and support that actually answers.
                        </p>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/shop"
                                className="group inline-flex rounded-full items-center justify-center gap-2 border border-[#C9A15C] bg-[#C9A15C] px-7 py-3.5 text-sm font-medium text-[#0B0C0E] transition-colors hover:bg-transparent hover:text-[#C9A15C]"
                            >
                                Browse all watches
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex rounded-full items-center justify-center gap-2 border border-[#EDEAE2]/25 px-7 py-3.5 text-sm font-medium text-[#EDEAE2] transition-colors hover:border-[#EDEAE2]"
                            >
                                Contact support
                            </Link>
                        </div>

                        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-[#1E1F21] pt-8">
                            {specs.map((spec) => (
                                <div key={spec.label}>
                                    <dt
                                        className="text-[#5f5d56]"
                                        style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.1em" }}
                                    >
                                        {spec.label.toUpperCase()}
                                    </dt>
                                    <dd className="mt-2 text-sm text-[#EDEAE2]">{spec.value}</dd>
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative mx-auto w-full max-w-md border border-[#1E1F21] bg-gradient-to-b from-[#111214] to-[#0a0a0b] p-8 sm:p-10"
                    >
                        <LiveWatch />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}