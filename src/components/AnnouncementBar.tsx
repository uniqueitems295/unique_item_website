"use client"

const MESSAGES = [
    "Limited Time: 2 Watches for the Price of 1",
    "Buy 1, Get 1 Matching Watch FREE",
    "Rs. 250 Delivery Charges (Advance Payment)",
    "Outlet Coming Soon",
]

export default function AnnouncementBar() {
    return (
        <div
            className="w-full overflow-hidden bg-[#0B0C0E] border-b border-white/10"
            aria-label="Announcements"
        >
            <div className="flex whitespace-nowrap announcement-track">
                {[0, 1].map((copy) => (
                    <ul
                        key={copy}
                        aria-hidden={copy === 1}
                        className="flex shrink-0 items-center"
                    >
                        {MESSAGES.map((msg, i) => (
                            <li key={i} className="flex items-center">
                                <span
                                    className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#fff]"
                                >
                                    {msg}
                                </span>
                                <span className="text-[#fff] text-xs select-none">•</span>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>

            <style jsx>{`
                .announcement-track {
                    animation: marquee 10s linear infinite;
                }

                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .announcement-track {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    )
}
