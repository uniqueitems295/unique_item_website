import { NextRequest, NextResponse } from "next/server"

const PUBLIC_ADMIN_PATHS = [
    "/admin/login",
    "/api/admin/login",
    "/api/admin/seed",
]

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAdminPage = pathname.startsWith("/admin")
    const isAdminApi = pathname.startsWith("/api/admin")

    if (!isAdminPage && !isAdminApi) return NextResponse.next()

    // allow public admin routes
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next()
    }

    // you must set this cookie on login
    const session = req.cookies.get("admin_session")?.value

    if (!session) {
        // if API request -> return JSON
        if (isAdminApi) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // if page request -> redirect to admin login
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
}
