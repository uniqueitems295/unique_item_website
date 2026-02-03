import { NextResponse } from "next/server"
import client from "@/lib/mongodb"
import { BetaAnalyticsDataClient } from "@google-analytics/data"

type OrderStatus =
  | "pending_verification"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "rejected"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

async function getVisitorStats() {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GA_CLIENT_EMAIL
  const privateKey = (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n")

  if (!propertyId || !clientEmail || !privateKey) {
    return {
      usersToday: 0,
      usersLast7Days: 0,
      pageViewsToday: 0,
      pageViewsLast7Days: 0,
    }
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

  return {
    usersToday,
    usersLast7Days,
    pageViewsToday,
    pageViewsLast7Days,
  }
}

export async function GET() {
  try {
    const mongo = await client.connect()
    const db = mongo.db()

    const ordersCol = db.collection("orders")
    const productsCol = db.collection("products")

    const totalOrders = await ordersCol.countDocuments()
    const totalProducts = await productsCol.countDocuments()

    const revenueAgg = await ordersCol
      .aggregate([
        { $match: { status: { $nin: ["cancelled", "rejected"] } } },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ])
      .toArray()

    const revenue = Number(revenueAgg?.[0]?.sum || 0)

    const productsOutOfStock = await productsCol.countDocuments({ inStock: false })
    const pendingOrders = await ordersCol.countDocuments({ status: "pending_verification" })

    const today = startOfToday()
    const dispatchedToday = await ordersCol.countDocuments({
      status: "dispatched",
      createdAt: { $gte: today.toISOString() },
    })

    const recentOrders = await ordersCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .project({ form: 1, total: 1, status: 1, createdAt: 1 })
      .toArray()

    const {
      usersToday,
      usersLast7Days,
      pageViewsToday,
      pageViewsLast7Days,
    } = await getVisitorStats()

    const data = {
      totalOrders,
      totalProducts,
      totalCustomers: 0,
      revenue,
      productsOutOfStock,
      pendingOrders,
      dispatchedToday,
      recentOrders,
      usersToday,
      usersLast7Days,
      pageViewsToday,
      pageViewsLast7Days,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Server error" },
      { status: 500 }
    )
  }
}
