"use client"

const MESSAGES = [
    "Buy One Timepiece — Receive One Complimentary. Two Watches, One Price.",
    "Cash on Delivery Available Nationwide — Seamless & Secure",
    "Inspect Your Order First. Satisfaction Confirmed Before You Pay.",
]

// Repeat 4 times so there's always enough content to fill the screen
// and the reset (at -50%) is invisible
const REPEATED = [...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES]

export default function AnnouncementBar() {
    return (
        <div
            className="w-full overflow-hidden bg-[#0B0C0E] border-b border-white/10"
            aria-label="Announcements"
        >
            {/* Two identical sets — animation moves first set fully off screen (-50%)
                at which point the second set is in exactly the same position the
                first set started, making the reset completely invisible */}
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
