import { User } from '@supabase/supabase-js'
import { NotificationBell } from './NotificationBell'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'

export function DashboardHeader({ user }: { user: User | null }) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Olá, {user?.user_metadata?.full_name || 'Aluno'}
                </h1>
                <p className="text-slate-500 text-sm">
                    Aqui está o resumo da sua evolução.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <NotificationBell />
                <form action={signout}>
                    <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                        Sair
                    </Button>
                </form>
            </div>
        </div>
    )
}
