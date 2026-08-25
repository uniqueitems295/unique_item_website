"use client"
const MESSAGES = [
    "Buy 1 watch get 1 free",
    "Cash on delivery",
    "First check then pay",
]
function MessageGroup() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, g) =>
                MESSAGES.map((msg, i) => (
                    <span key={`${g}-${i}`} className="flex items-center shrink-0">
                        <span className="px-8 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white">
                            {msg}
                        </span>
                        <span className="text-[#C9A15C] text-[10px] select-none pr-2">◆</span>
                    </span>
                ))
            )}
        </>
    )
}
export default function AnnouncementBar() {
    return (
        <div
            className="w-full overflow-hidden bg-[#0B0C0E] border-b border-white/10"
            aria-label="Announcements"
        >
            <div className="announcement-marquee flex w-max whitespace-nowrap">
                <div className="flex shrink-0 items-center">
                    <MessageGroup />
                </div>
                <div className="flex shrink-0 items-center" aria-hidden="true">
                    <MessageGroup />
                </div>
            </div>
        </div>
    )
}