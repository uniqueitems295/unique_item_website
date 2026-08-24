"use client"

const MESSAGES = [
    "Buy 1 watch get 1 free",
    "Cash on delivery",
    "First check then pay",
]


export default function AnnouncementBar() {
    return (
        <div
            className="w-full overflow-hidden bg-[#0B0C0E] border-b border-white/10"
            aria-label="Announcements"
        >
            <div className="announcement-marquee flex whitespace-nowrap">
                {[0, 1].map((copy) => (
                    <div
                        key={copy}
                        aria-hidden={copy === 1}
                        className="flex shrink-0 items-center"
                    >
                        {MESSAGES.map((msg, i) => (
                            <span key={i} className="flex items-center shrink-0">
                                <span className="px-8 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white">
                                    {msg}
                                </span>
                                <span className="text-[#C9A15C] text-[10px] select-none pr-2">◆</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
