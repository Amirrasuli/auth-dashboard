import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OTP = '123456'

export async function POST(req: Request) {
    const { phone } = await req.json()
    
    if (!phone) {
        return NextResponse.json({ error: 'شماره تلفن الزامی است' }, { status: 400 })
    }
    
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000)
    
    await prisma.otp.create({
        data: {
            phone,
            code: DEFAULT_OTP,
            expiresAt,
        },
    })
    
    console.log(`OTP for ${phone}: ${DEFAULT_OTP}`)
    
    return NextResponse.json({ message: 'کد ارسال شد' })
}
