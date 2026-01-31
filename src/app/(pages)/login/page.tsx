"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Shield } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    // create admin

    // fetch("/api/admin/seed", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ secret: "some-very-long-secret" })
    // }).then(r => r.json()).then(console.log)


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            await axios.post("/api/admin/login", {
                email: email.trim(),
                password: password.trim(),
            })

            toast("Login successful.")
            router.push("/admin")
            router.refresh()
        } catch (err: any) {
            toast(err?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto grid min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div className="hidden lg:block">
                    <div className="relative overflow-hidden rounded-[28px] border bg-zinc-50 p-10">
                        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

                        <Badge variant="secondary" className="rounded-full px-4 py-1">
                            Admin Panel
                        </Badge>

                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                            Unique Items
                            <span className="block text-zinc-700">Admin Access Only</span>
                        </h1>

                        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600">
                            This page is restricted for administrators. Please sign in to manage products, orders, and website content.
                        </p>

                        <div className="mt-10 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900">Secure Area</p>
                                <p className="text-sm text-zinc-600">Unauthorized access is blocked</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <Card className="rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Admin Login</CardTitle>
                            <CardDescription>Sign in to access the admin dashboard.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={onSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Admin Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter admin email"
                                        className="h-11"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            className="h-11 pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="h-11 w-full rounded-xl" disabled={loading}>
                                    {loading ? <Spinner /> : "Login"}
                                </Button>
                            </form>

                            <p className="text-center text-xs text-zinc-500">
                                Back to website{" "}
                                <Link href="/" className="underline underline-offset-4">
                                    Home
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
