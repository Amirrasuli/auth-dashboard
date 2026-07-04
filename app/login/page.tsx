'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(0)
    
    const otpInputRef = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        if (countdown <= 0) return
        const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
        return () => clearInterval(timer)
    }, [countdown])
    
    useEffect(() => {
        if (step === 'otp') otpInputRef.current?.focus()
    }, [step])
    
    async function sendOtp() {
        if (!phone.trim()) {
            setError('لطفاً شماره تلفن را وارد کنید')
            return
        }
        
        setLoading(true)
        setError('')
        
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                setError(data.message || 'خطا در ارسال کد')
                return
            }
            
            setStep('otp')
            setCode('')
            setCountdown(60)
        } catch {
            setError('خطا در ارتباط با سرور')
        } finally {
            setLoading(false)
        }
    }
    
    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault()
        
        if (code.length !== 6) {
            setError('کد باید ۶ رقم باشد')
            return
        }
        
        setLoading(true)
        setError('')
        
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code }),
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                setError(data.message || 'کد وارد شده صحیح نیست')
                return
            }
            
            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('خطا در ارتباط با سرور')
        } finally {
            setLoading(false)
        }
    }
    
    function handlePhoneSubmit(e: React.FormEvent) {
        e.preventDefault()
        sendOtp()
    }
    
    function handleResend() {
        if (countdown > 0) return
        sendOtp()
    }
    
    function handleEditPhone() {
        setStep('phone')
        setCode('')
        setError('')
        setCountdown(0)
    }
    
    return (
        <div
            dir="rtl"
            className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
        >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all duration-300">
                <h1 className="text-xl font-semibold text-slate-800 mb-1 text-center">
                    ورود به حساب کاربری
                </h1>
                <p className="text-sm text-slate-400 text-center mb-6">
                    {step === 'phone'
                        ? 'شماره تلفن خود را وارد کنید'
                        : `کد ارسال‌شده به ${phone} را وارد کنید`}
                </p>
                
                {error && (
                    <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center animate-pulse">
                        {error}
                    </div>
                )}
                
                {step === 'phone' ? (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="09xxxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-center tracking-wide border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                            maxLength={11}
                            autoFocus
                        />
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl py-3 text-sm font-medium transition"
                        >
                            {loading ? 'در حال ارسال...' : 'ارسال کد'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                        <input
                            ref={otpInputRef}
                            type="text"
                            inputMode="numeric"
                            placeholder="------"
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                            }
                            className="w-full text-center text-lg tracking-[0.5em] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                            maxLength={6}
                        />
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl py-3 text-sm font-medium transition"
                        >
                            {loading ? 'در حال بررسی...' : 'تأیید کد'}
                        </button>
                        
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <button
                                type="button"
                                onClick={handleEditPhone}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                ویرایش شماره
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={countdown > 0}
                                className="text-slate-500 hover:text-slate-700 disabled:text-slate-300 transition"
                            >
                                {countdown > 0 ? `ارسال مجدد (${countdown})` : 'ارسال مجدد کد'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
