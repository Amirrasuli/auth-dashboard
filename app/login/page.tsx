'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    async function handleSendOtp(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                setError(data.error || 'خطایی رخ داد')
                return
            }
            
            setStep('otp')
        } catch {
            setError('ارتباط با سرور برقرار نشد')
        } finally {
            setLoading(false)
        }
    }
    
    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code }),
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                setError(data.error || 'کد نامعتبر است')
                return
            }
            
            router.push('/dashboard')
        } catch {
            setError('ارتباط با سرور برقرار نشد')
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-slate-50"
        >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 transition-all duration-300">
                <h1 className="text-xl font-bold text-slate-800 mb-1 text-center">
                    ورود به حساب کاربری
                </h1>
                <p className="text-sm text-slate-500 text-center mb-6">
                    {step === 'phone'
                        ? 'شماره تلفن خود را وارد کنید'
                        : `کد ارسال شده به ${phone} را وارد کنید`}
                </p>
                
                {step === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="09xxxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
                        />
                        
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-800 text-white rounded-lg py-2.5 font-medium hover:bg-slate-700 active:scale-[0.98] transition disabled:opacity-50"
                        >
                            {loading ? 'در حال ارسال...' : 'دریافت کد'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="کد ۶ رقمی"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full text-center tracking-[0.5em] rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
                        />
                        
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-800 text-white rounded-lg py-2.5 font-medium hover:bg-slate-700 active:scale-[0.98] transition disabled:opacity-50"
                        >
                            {loading ? 'در حال بررسی...' : 'تایید و ورود'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="w-full text-sm text-slate-500 hover:text-slate-700 transition"
                        >
                            ویرایش شماره تلفن
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
