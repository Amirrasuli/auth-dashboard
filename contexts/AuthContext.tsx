'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    userId: string
    phone: string
}

interface AuthContextType {
    user: User | null
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
                                 initialUser,
                                 children,
                             }: {
    initialUser: User | null
    children: React.ReactNode
}) {
    const [user, setUser] = useState(initialUser)
    const router = useRouter()
    
    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        router.push('/login')
        router.refresh()
    }
    
    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود')
    return ctx
}
