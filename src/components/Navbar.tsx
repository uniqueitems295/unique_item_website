"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Search, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

type CartItem = {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
    qty: number;
};

function readCartCount(): number {
    if (typeof window === "undefined") return 0;
    try {
        const raw = localStorage.getItem("cart");
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return 0;

        return parsed.reduce((sum: number, item: any) => {
            const qty = Number(item?.qty ?? 1);
            return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
        }, 0);
    } catch {
        return 0;
    }
}

function CartIconWithBadge({ count }: { count: number }) {
    return (
        <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -right-2 -top-2 min-w-[18px] rounded-full bg-red-600 px-1.5 py-[2px] text-center text-[10px] font-semibold leading-none text-white">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const [cartCount, setCartCount] = React.useState(0);
    const [search, setSearch] = React.useState("");

    const syncCartCount = React.useCallback(() => {
        setCartCount(readCartCount());
    }, []);

    React.useEffect(() => {
        syncCartCount();

        const onStorage = (e: StorageEvent) => {
            if (e.key === "cart") syncCartCount();
        };

        window.addEventListener("storage", onStorage);

        const poll = window.setInterval(() => {
            syncCartCount();
        }, 800);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.clearInterval(poll);
        };
    }, [syncCartCount]);

    const goToShopWithSearch = (q: string) => {
        const value = q.trim();
        if (value) router.push(`/shop?q=${encodeURIComponent(value)}`);
        else router.push("/shop");
        setOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex h-20 md:h-22 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={"/logo1.png"}
                        alt="Unique Items logo"
                        width={150}
                        height={150}
                        className="md:h-20 h-16 w-auto"
                    />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                    active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <form
                        className="relative w-[260px] md:mr-10"
                        onSubmit={(e) => {
                            e.preventDefault();
                            goToShopWithSearch(search);
                        }}
                    >
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search watches..."
                            className="h-10 rounded-lg pl-9"
                        />
                    </form>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Cart">
                            <CartIconWithBadge count={cartCount} />
                        </Button>
                    </Link>

                    <Button
                        type="button"
                        className="h-10 rounded-xl px-4"
                        onClick={() => goToShopWithSearch(search)}
                    >
                        Shop
                    </Button>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="rounded-lg bg-zinc-100" aria-label="Cart">
                            <CartIconWithBadge count={cartCount} />
                        </Button>
                    </Link>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-lg">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[320px] p-0">
                            <div className="flex items-center justify-between border-b px-4 py-4">
                                <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-zinc-200 relative z-10 rounded-xl"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-4">
                                <form
                                    className="relative"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        goToShopWithSearch(search);
                                    }}
                                >
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search watches..."
                                        className="h-10 rounded-lg pl-9"
                                    />
                                </form>

                                <Button
                                    type="button"
                                    className="mt-3 h-10 w-full rounded-xl"
                                    onClick={() => goToShopWithSearch(search)}
                                >
                                    Search in Shop
                                </Button>

                                <div className="mt-4 grid gap-2">
                                    {navLinks.map((item) => {
                                        const active = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                                                    active
                                                        ? "border-zinc-900 bg-zinc-900 text-white"
                                                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                                                )}
                                            >
                                                {item.name}
                                                <span className="text-xs opacity-70">
                                                    <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
