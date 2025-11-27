import { CheckinWizard } from '@/components/checkin/CheckinWizard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CheckinPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Check-in Mensal</h1>
                    <p className="mt-2 text-gray-600">
                        Reserve um momento para refletir sobre seu progresso.
                    </p>
                </div>

                <CheckinWizard />
            </div>
        </div>
    )
}
