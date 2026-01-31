import UserWrapper from "@/app/(wrappers)/userWrapper";
import React from "react";

export default function PrivacyPolicyPage() {
    return (
        <UserWrapper>
            <div className="min-h-screen bg-white">
                <section className="border-b bg-zinc-50">
                    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                            Privacy Policy
                        </h1>
                        <p className="mt-3 text-sm text-zinc-600 sm:text-base">
                            Last updated: {new Date().getFullYear()}
                        </p>
                    </div>
                </section>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-5xl space-y-10 px-6">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Introduction
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                At Unique Items, your privacy is important to us. This Privacy
                                Policy explains how we collect, use, and protect your personal
                                information when you visit our website or make a purchase.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Information We Collect
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We may collect the following information:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-600 sm:text-base">
                                <li>Your name, phone number, email address, and shipping address</li>
                                <li>Order and payment details</li>
                                <li>Messages sent through our contact forms or support channels</li>
                                <li>Browsing behavior on our website (via cookies)</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                How We Use Your Information
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We use your information to:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-600 sm:text-base">
                                <li>Process and deliver your orders</li>
                                <li>Communicate order updates and support responses</li>
                                <li>Improve our products and website experience</li>
                                <li>Prevent fraud and unauthorized activities</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Cookies
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We use cookies to enhance your browsing experience. Cookies help
                                us understand user behavior, remember preferences, and improve
                                site performance. You can disable cookies in your browser
                                settings if you prefer.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Data Protection
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We take appropriate security measures to protect your personal
                                data from unauthorized access, alteration, or disclosure. Your
                                information is only accessible to authorized personnel.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Third-Party Services
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We may share limited information with trusted third-party
                                services such as payment processors and delivery partners only
                                to complete your order. We do not sell or rent your personal
                                data to third parties.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Your Rights
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                You have the right to:
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-600 sm:text-base">
                                <li>Request access to your personal information</li>
                                <li>Request correction or deletion of your data</li>
                                <li>Opt out of marketing communications</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Changes to This Policy
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                We may update this Privacy Policy from time to time. Any changes
                                will be posted on this page with an updated revision date.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Contact Us
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                                If you have any questions about this Privacy Policy or how we
                                handle your data, please contact us at:
                            </p>
                            <p className="text-sm font-medium text-zinc-900">
                                Email: support@uniqueitems.pk
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </UserWrapper>
    );
}
