'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

export default function Faq() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'watch',
            question: 'Are your watches brand new?',
            answer:
                'Yes. All watches listed on Unique Items are brand new and carefully checked before dispatch. Product details and condition are mentioned on each product page.',
        },
        {
            id: 'item-2',
            icon: 'truck',
            question: 'How long does delivery take?',
            answer:
                'Delivery usually takes 2–5 working days depending on your city. After your order is confirmed, we share tracking details so you can follow your parcel.',
        },
        {
            id: 'item-3',
            icon: 'credit-card',
            question: 'Do you offer Cash on Delivery?',
            answer:
                'Yes, Cash on Delivery (COD) is available in most areas. You can also pay using card or bank transfer where available at checkout.',
        },
        {
            id: 'item-4',
            icon: 'shield-check',
            question: 'Do you provide warranty?',
            answer:
                'We provide a limited warranty on selected watches. Warranty duration and coverage are mentioned on the product page. If you have any issue, our support team will help you.',
        },
        {
            id: 'item-5',
            icon: 'rotate-ccw',
            question: 'What is your return or exchange policy?',
            answer:
                'If you receive a damaged or wrong product, you can request a return or exchange within 7 days of delivery. The item must be unused and in original packaging.',
        },
        {
            id: 'item-6',
            icon: 'ruler',
            question: 'How can I choose the right size?',
            answer:
                'Each product page includes dial size and strap details when available. If you’re unsure, contact us and we’ll guide you based on your wrist size and style preference.',
        },
        {
            id: 'item-7',
            icon: 'map-pin',
            question: 'Do you deliver all over Pakistan?',
            answer:
                'Yes, we deliver nationwide across Pakistan. Shipping cost (if any) is shown at checkout before you place your order.',
        },
        {
            id: 'item-8',
            icon: 'message-circle',
            question: 'How can I contact support?',
            answer:
                'You can contact our support team through the Contact page or by sending us a message on our official social pages. We typically reply within 24 hours.',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-36">
                            <h2 className="mt-4 text-3xl md:text-4xl font-semibold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can’t find what you’re looking for? Contact our{' '}
                                <Link href="/contact" className="text-primary font-medium hover:underline">
                                    support team
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                                >
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon name={item.icon} className="m-auto size-4" />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
