import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env.local")
}

type MongooseCache = {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as { mongoose: MongooseCache }

if (!globalForMongoose.mongoose) {
    globalForMongoose.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (globalForMongoose.mongoose.conn) return globalForMongoose.mongoose.conn

    if (!globalForMongoose.mongoose.promise) {
        globalForMongoose.mongoose.promise = mongoose
            .connect(MONGODB_URI, { dbName: "unique-items" })
            .then((m) => m)
    }

    globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise
    return globalForMongoose.mongoose.conn
}
