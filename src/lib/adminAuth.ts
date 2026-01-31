import jwt from "jsonwebtoken"

const secret = process.env.ADMIN_JWT_SECRET!

export type AdminSession = { id: string; email: string }

export function signAdminSession(payload: AdminSession) {
    if (!secret) throw new Error("Missing ADMIN_JWT_SECRET")
    return jwt.sign(payload, secret, { expiresIn: "7d" })
}

export function verifyAdminSession(token: string): AdminSession | null {
    try {
        return jwt.verify(token, secret) as AdminSession
    } catch {
        return null
    }
}
