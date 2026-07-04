import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    const { phone, code } = await req.json()
    
    const otp = await prisma.otp.findFirst({
        where: { phone, code, verified: false },
        orderBy: { createdAt: 'desc' },
    })
    
    if (!otp) {
        return NextResponse.json({ error: 'کد نامعتبر است' }, { status: 400 })
    }
    
    if (otp.expiresAt < new Date()) {
        return NextResponse.json({ error: 'کد منقضی شده است' }, { status: 400 })
    }
    
    await prisma.otp.update({
        where: { id: otp.id },
        data: { verified: true },
    })
    
    let user = await prisma.user.findUnique({ where: { phone } })
    
    if (!user) {
        user = await prisma.user.create({
            data: { phone, name: 'کاربر جدید' },
        })
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    })
    
    const response = NextResponse.json({ message: 'ورود موفق' })
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })
    
    return response
}
