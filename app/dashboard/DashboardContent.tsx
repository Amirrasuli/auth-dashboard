'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function DashboardContent() {
    const { user, logout } = useAuth()
    
    return (
        <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">خوش آمدید</p>
                    <p className="font-medium text-slate-800">{user?.phone}</p>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 transition"
                >
                    خروج
                </button>
            </header>
            
            <main className="flex-1 flex items-center justify-center">
                <p className="text-slate-400">محتوای داشبورد</p>
            </main>
        </div>
    )
}
