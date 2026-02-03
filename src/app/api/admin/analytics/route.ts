import { NextResponse } from "next/server"
import { BetaAnalyticsDataClient } from "@google-analytics/data"

function getPrivateKey() {
    return (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n")
}

export async function GET() {
    try {
        const propertyId = process.env.GA_PROPERTY_ID
        const clientEmail = process.env.GA_CLIENT_EMAIL
        const privateKey = getPrivateKey()

        if (!propertyId || !clientEmail || !privateKey) {
            return NextResponse.json(
                { message: "GA env vars missing" },
                { status: 500 }
            )
        }

        const analytics = new BetaAnalyticsDataClient({
            credentials: { client_email: clientEmail, private_key: privateKey },
        })

        // Users Today + Users Last 7 Days
        const [report] = await analytics.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "date" }],
        })

        const rows = report.rows || []

        const usersLast7Days = rows.reduce((sum, r) => {
            const v = Number(r.metricValues?.[0]?.value || 0)
            return sum + v
        }, 0)

        const todayYYYYMMDD = new Date()
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "") // 20260203

        const todayRow = rows.find((r) => r.dimensionValues?.[0]?.value === todayYYYYMMDD)
        const usersToday = Number(todayRow?.metricValues?.[0]?.value || 0)

        return NextResponse.json(
            {
                data: {
                    usersToday,
                    usersLast7Days,
                    // realtime "active now" needs GA realtime API; we can add later if you want
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { message: "Analytics error", error: error?.message || "Unknown error" },
            { status: 500 }
        )
    }
}
