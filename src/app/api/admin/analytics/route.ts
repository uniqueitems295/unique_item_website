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
      return NextResponse.json({ message: "GA env vars missing" }, { status: 500 })
    }

    const analytics = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    })

    const [todayReport] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "today", endDate: "today" }],
      metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
    })

    const usersToday = Number(todayReport.rows?.[0]?.metricValues?.[0]?.value || 0)
    const pageViewsToday = Number(todayReport.rows?.[0]?.metricValues?.[1]?.value || 0)

    const [last7Report] = await analytics.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
    })

    const usersLast7Days = Number(last7Report.rows?.[0]?.metricValues?.[0]?.value || 0)
    const pageViewsLast7Days = Number(last7Report.rows?.[0]?.metricValues?.[1]?.value || 0)

    return NextResponse.json(
      {
        data: {
          usersToday,
          usersLast7Days,
          pageViewsToday,
          pageViewsLast7Days,
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
