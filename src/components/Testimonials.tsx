import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center ">
                    <h2 className="text-3xl font-medium max-w-sm capitalize leading-tight mx-auto lg:text-4xl">
                        Loved by customers across Pakistan
                    </h2>
                    <p className="text-muted-foreground">
                        Real reviews from people who bought watches from Unique Items—quality, style, and delivery you can trust.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                            <p className="text-sm font-semibold tracking-tight text-zinc-900">
                                Verified Purchase
                            </p>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    The watch looks truly premium and feels solid on the wrist. The finishing is very clean, the dial details are sharp, and the strap quality is much better than I expected for this price. It’s comfortable to wear all day and matches both casual and formal outfits. Delivery was fast, the packaging was secure, and the product arrived in perfect condition. Overall, I’m very satisfied with my purchase.
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/images/testimonials/ahmed.jpg"
                                            alt="Ahmed Khan"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AK</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Ahmed Khan</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            Lahore
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    I bought it as a gift and it looked exactly like the pictures. The dial is elegant and the overall feel is classy. I’ll definitely order again.
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/images/testimonials/ayesha.jpg"
                                            alt="Ayesha Malik"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>AM</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Ayesha Malik</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            Karachi
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-base font-medium">
                                    Cash on delivery made it easy. The watch is comfortable, looks stylish, and arrived on time. Support responded quickly on WhatsApp.
                                </p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/images/testimonials/usman.jpg"
                                            alt="Usman Ali"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>UA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Usman Ali</cite>
                                        <span className="text-muted-foreground block text-sm">
                                            Islamabad
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-base font-medium">
                                    Excellent quality for the price. The bracelet feels strong and the dial details are sharp. This store is a great option for budget premium watches.
                                </p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="/images/testimonials/sara.jpg"
                                            alt="Sara Noor"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>SN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Sara Noor</p>
                                        <span className="text-muted-foreground block text-sm">
                                            Rawalpindi
                                        </span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
