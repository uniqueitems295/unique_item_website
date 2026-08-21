import { MongoClient, MongoClientOptions } from "mongodb"
import dns from "dns"

// Local DNS often can't resolve MongoDB Atlas SRV records.
// Force Google DNS + IPv4-first to fix querySrv ECONNREFUSED locally.
if (!process.env.VERCEL) {
    dns.setServers(["8.8.8.8", "8.8.4.4"])
    dns.setDefaultResultOrder("ipv4first")
}

const options: MongoClientOptions = {
    appName: "devrel.vercel.integration",
    maxIdleTimeMS: 5000,
}

const client = new MongoClient(process.env.MONGODB_URI as string, options)

// attachDatabasePool is a Vercel-only runtime API — skip it in local dev
if (process.env.VERCEL) {
    const { attachDatabasePool } = require("@vercel/functions")
    attachDatabasePool(client)
}

export default client
