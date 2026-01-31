"use client"

import * as React from "react"
import axios from "axios"
import { toast } from "sonner"
import { CardContent } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Spinner } from "@/components/ui/spinner"

type FormState = {
    firstName: string
    lastName: string
    email: string
    whatsapp: string
    subject: string
    message: string
}

const initial: FormState = {
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
}

export default function ContactUsForm() {
    const [form, setForm] = React.useState<FormState>(initial)
    const [loading, setLoading] = React.useState(false)

    const setField = (k: keyof FormState, v: string) => {
        setForm((prev) => ({ ...prev, [k]: v }))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            whatsapp: form.whatsapp.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
        }

        if (!payload.firstName || !payload.lastName || !payload.email || !payload.whatsapp || !payload.subject || !payload.message) {
            toast("Please fill all fields.")
            return
        }

        try {
            setLoading(true)
            await axios.post("/api/contact", payload)
            toast("Your message has been submitted.")
            setForm(initial)
        } catch (e: any) {
            toast(e?.response?.data?.message || "Failed to submit message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <CardContent className="mt-2">
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                        <div className="md:col-span-1">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="First name"
                                className="mt-2 h-10 bg-white shadow-none"
                                value={form.firstName}
                                onChange={(e) => setField("firstName", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Last name"
                                className="mt-2 h-10 bg-white shadow-none"
                                value={form.lastName}
                                onChange={(e) => setField("lastName", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@email.com"
                                className="mt-2 h-10 bg-white shadow-none"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="number">Whatsapp Number</Label>
                            <Input
                                id="number"
                                inputMode="tel"
                                placeholder="0300 0000000"
                                className="mt-2 h-10 bg-white shadow-none"
                                value={form.whatsapp}
                                onChange={(e) => setField("whatsapp", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="Order issue / Return / Product question"
                                className="mt-2 h-10 bg-white shadow-none"
                                value={form.subject}
                                onChange={(e) => setField("subject", e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Write your message here..."
                                className="mt-2 bg-white shadow-none"
                                rows={6}
                                value={form.message}
                                onChange={(e) => setField("message", e.target.value)}
                            />
                        </div>
                    </div>

                    <Button className="w-full" size="lg" disabled={loading}>
                        {loading ? <Spinner /> : "Submit"}
                    </Button>
                </form>
            </CardContent>
        </div>
    )
}
