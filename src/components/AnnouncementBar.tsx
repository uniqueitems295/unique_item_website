"use client"

const MESSAGES = [
    "Buy any 2 Watches & Get free Watch adjuster Tool",
    "RS 250 delivery charges advance payment required",
    "OUTLET COMING SOON",
    "Buy any 2 Watches & Get free Watch adjuster Tool",
    "RS 250 delivery charges advance payment required",
    "OUTLET COMING SOON",
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
