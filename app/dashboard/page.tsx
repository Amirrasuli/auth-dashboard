import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AuthProvider } from '@/contexts/AuthContext'
import DashboardContent from './DashboardContent'

export default async function DashboardPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')
    
    return (
        <AuthProvider initialUser={user}>
            <DashboardContent />
        </AuthProvider>
    )
}
