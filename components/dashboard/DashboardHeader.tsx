import { User } from '@supabase/supabase-js'
import { NotificationBell } from './NotificationBell'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

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
                <Link href="/checkin">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Novo Check-in
                    </Button>
                </Link>
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
