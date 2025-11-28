import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { ConfidenceChart } from '@/components/dashboard/ConfidenceChart'
import { ActionPlanWidget } from '@/components/dashboard/ActionPlanWidget'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check user role - redirect mentors to their page
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'mentor') {
        redirect('/mentor')
    }

    // Fetch check-ins
    const { data: checkins } = await supabase
        .from('checkins')
        .select('*')
        .eq('student_id', user.id)
        .order('month_year', { ascending: true })

    const safeCheckins = checkins || []
    const hasCheckins = safeCheckins.length > 0
    const latestCheckin = hasCheckins ? safeCheckins[safeCheckins.length - 1] : null

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <DashboardHeader user={user} />

                {!hasCheckins ? (
                    <EmptyState
                        icon={Rocket}
                        title="Bem-vindo à Mentoria!"
                        description="Você ainda não realizou nenhum check-in. Comece agora para acompanhar sua evolução."
                        action={
                            <Link href="/checkin">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                                    Fazer primeiro Check-in
                                </Button>
                            </Link>
                        }
                    />
                ) : (
                    <>
                        <KPIGrid latestCheckin={latestCheckin} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <ConfidenceChart data={safeCheckins} />
                            </div>
                            <div>
                                <ActionPlanWidget />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
