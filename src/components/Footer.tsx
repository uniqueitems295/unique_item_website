import Link from "next/link";
import { Watch, Facebook, Instagram, Twitter, Mail, Phone, LucideTwitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586383334472-84d9bc3a9fe3?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
            className="border-t text-zinc-200">
            <div className="bg-black/75">
                <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 md:pt-24">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-4">
                            <Link href={"/"} className="block">
                                <Image src={"/logo1.png"} alt="Unique Items" width={200} height={200} className="invert h-24 w-auto" />
                            </Link>
                            <p className="text-zinc-300">
                                Unique Items is your trusted online store for premium, stylish,
                                and affordable watches for men, women, and kids.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold uppercase tracking-wide">
                                Shop
                            </h3>
                            <ul className="space-y-3 text-zinc-300">
                                <li>
                                    <Link href="/shop" className="hover:text-white">
                                        All Watches
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-white">
                                        Men Watches
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-white">
                                        Women Watches
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-white">
                                        Kids Watches
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold uppercase tracking-wide">
                                Company
                            </h3>
                            <ul className="space-y-3 text-zinc-300">
                                <li>
                                    <Link href="/about" className="hover:text-white">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-white">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/home#faq" className="hover:text-white">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-white">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold uppercase tracking-wide">
                                Contact
                            </h3>
                            <ul className="space-y-4 text-zinc-300">
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    support@uniqueitems.pk
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    +92 300 1234567
                                </li>
                                <li className="flex gap-3 pt-2">
                                    <Link
                                        href="#"
                                        className="rounded-full transition-all bg-zinc-800 p-4 hover:bg-white hover:text-zinc-900"
                                    >
                                        <Facebook className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="rounded-full transition-all bg-zinc-800 p-4 hover:bg-white hover:text-zinc-900"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="rounded-full transition-all bg-zinc-800 p-4 hover:bg-white hover:text-zinc-900"
                                    >
                                        <LucideTwitter className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="rounded-full transition-all bg-zinc-800 p-4 hover:bg-white hover:text-zinc-900"
                                    >
                                        <LucideTwitter className="h-5 w-5" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-sm text-zinc-400 md:flex-row">
                        <p>© {new Date().getFullYear()} Unique Items. All rights reserved.</p>
                        <p className="md:block hidden">Designed for premium watch lovers</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
