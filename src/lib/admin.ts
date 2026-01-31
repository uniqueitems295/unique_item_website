import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export type AdminDoc = {
    _id: ObjectId
    email: string
    passwordHash: string
    createdAt: Date
}

export async function adminsCollection() {
    const client = await clientPromise
    const db = client.db()
    return db.collection<AdminDoc>("admins")
}

export async function ensureAdminIndexes() {
    const col = await adminsCollection()
    await col.createIndex({ email: 1 }, { unique: true })
}

export async function createAdmin(email: string, password: string) {
    const col = await adminsCollection()
    await ensureAdminIndexes()
    const passwordHash = await bcrypt.hash(password, 10)
    const doc = {
        email: email.toLowerCase().trim(),
        passwordHash,
        createdAt: new Date(),
    }
    const res = await col.insertOne(doc as any)
    return { id: res.insertedId.toString(), email: doc.email }
}

export async function verifyAdmin(email: string, password: string) {
    const col = await adminsCollection()
    const admin = await col.findOne({ email: email.toLowerCase().trim() })
    if (!admin) return null
    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) return null
    return { id: admin._id.toString(), email: admin.email }
}
