import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/mentor/DashboardStats'
import { StudentsTable } from '@/components/mentor/StudentsTable'

export default async function MentorPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch students (profiles with role 'student')
    const { data: students } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')

    // Fetch all checkins
    const { data: checkins } = await supabase
        .from('checkins')
        .select('*')
        .order('month_year', { ascending: false })

    // Process data for dashboard
    const studentList = students || []
    const checkinList = checkins || []

    // Calculate stats
    const totalStudents = studentList.length

    // Checkins pending for current month (simplified logic: check if latest checkin is from current month)
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const submittedThisMonth = checkinList.filter(c => c.month_year.startsWith(currentMonth)).length
    const pendingCheckins = Math.max(0, totalStudents - submittedThisMonth)

    // Total revenue (sum of latest checkin revenue for each student)
    // We need to group checkins by student_id and take the latest one
    const latestCheckinsMap = new Map()
    checkinList.forEach(checkin => {
        if (!latestCheckinsMap.has(checkin.student_id)) {
            latestCheckinsMap.set(checkin.student_id, checkin)
        }
    })

    let totalRevenue = 0
    let riskCount = 0

    const studentsWithData = studentList.map(student => {
        const lastCheckin = latestCheckinsMap.get(student.id)

        if (lastCheckin) {
            totalRevenue += Number(lastCheckin.revenue || 0)

            // Risk logic: Late (> 35 days) or low confidence (< 5)
            const daysSinceCheckin = (new Date().getTime() - new Date(lastCheckin.created_at).getTime()) / (1000 * 3600 * 24)
            if (daysSinceCheckin > 35 || (lastCheckin.confidence_level && lastCheckin.confidence_level < 5)) {
                riskCount++
            }
        } else {
            // No checkin ever = Risk
            riskCount++
        }

        return {
            ...student,
            last_checkin: lastCheckin
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel do Mentor</h1>
                        <p className="text-slate-500 text-sm">Visão Geral da Mentoria</p>
                    </div>
                </div>

                <DashboardStats
                    totalStudents={totalStudents}
                    pendingCheckins={pendingCheckins}
                    totalRevenue={totalRevenue}
                    riskCount={riskCount}
                />

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Alunos</h2>
                    <StudentsTable students={studentsWithData} />
                </div>
            </div>
        </div>
    )
}
