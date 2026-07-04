import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface TokenPayload {
    userId: string
    phone: string
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    } catch {
        return null
    }
}
