import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { StudentProfile } from '@/components/mentor/StudentProfile'
import { CheckinHistory } from '@/components/mentor/CheckinHistory'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function StudentDetailsPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch student profile
    const { data: student, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (studentError || !student) {
        return <div>Aluno não encontrado.</div>
    }

    // Fetch checkins
    // Fetch checkins with their feedback
    const { data: checkins } = await supabase
        .from('checkins')
        .select('*, checkin_feedback(*)')
        .eq('student_id', id)
        .order('month_year', { ascending: false })

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/mentor">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Prontuário do Aluno</h1>
                        <p className="text-slate-500 text-sm">Visão detalhada e histórico</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Notes */}
                    <div className="lg:col-span-1">
                        <StudentProfile student={student} mentorId={user.id} />
                    </div>

                    {/* Right Column: Checkin History */}
                    <div className="lg:col-span-2">
                        <CheckinHistory checkins={checkins || []} isMentor={true} studentId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
