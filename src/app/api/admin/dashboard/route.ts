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

function getPrivateKey() {
  // env often stores newlines as \n
  return (process.env.GA_PRIVATE_KEY || "").replace(/\\n/g, "\n")
}

async function getVisitorStats() {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GA_CLIENT_EMAIL
  const privateKey = getPrivateKey()

  // If GA not configured, just return zeros (don’t break dashboard)
  if (!propertyId || !clientEmail || !privateKey) {
    return { usersToday: 0, usersLast7Days: 0 }
  }

  const analytics = new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  })

  // activeUsers per date (last 7 days including today)
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

  const todayYYYYMMDD = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  const todayRow = rows.find((r) => r.dimensionValues?.[0]?.value === todayYYYYMMDD)
  const usersToday = Number(todayRow?.metricValues?.[0]?.value || 0)

  return { usersToday, usersLast7Days }
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

    // ✅ NEW: GA4 Visitors
    const { usersToday, usersLast7Days } = await getVisitorStats()

    const data = {
      totalOrders,
      totalProducts,
      totalCustomers: 0,
      revenue,
      productsOutOfStock,
      pendingOrders,
      dispatchedToday,
      recentOrders,

      // ✅ add these
      usersToday,
      usersLast7Days,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 })
  }
}
