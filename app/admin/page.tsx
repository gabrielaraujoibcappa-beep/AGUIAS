import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminUserTable } from '@/components/admin/AdminUserTable'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch current user profile to check role
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Allow access only for admin and mentor roles
    if (currentUserProfile?.role !== 'admin' && currentUserProfile?.role !== 'mentor') {
        redirect('/dashboard')
    }

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    // Filter mentors for the dropdown
    const mentors = profiles?.filter(p => p.role === 'mentor') || []

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
                    <p className="text-slate-500">Gerencie usuários, funções e vínculos.</p>
                </div>

                <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <AdminUserTable users={profiles || []} mentors={mentors} />
                </div>
            </div>
        </div>
    )
}
