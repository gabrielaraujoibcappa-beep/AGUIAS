'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react'

interface Student {
    id: string
    full_name: string
    email: string
    avatar_url?: string
}

interface Checkin {
    student_id: string
    confidence_level?: number
    month_year: string
    revenue?: number
}

export function StudentList({ students, checkins }: { students: any[], checkins: any[] }) {

    const getLatestCheckin = (studentId: string) => {
        return checkins.find(c => c.student_id === studentId)
    }

    const getRiskStatus = (checkin: Checkin | undefined) => {
        if (!checkin) return { label: 'Sem dados', color: 'bg-slate-100 text-slate-600 border-slate-200' }

        if (checkin.confidence_level && checkin.confidence_level < 4) {
            return { label: 'Risco Alto', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle }
        }
        if (checkin.confidence_level && checkin.confidence_level < 7) {
            return { label: 'Atenção', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle }
        }
        return { label: 'Estável', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Aluno</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Último Check-in</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Faturamento</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</TableHead>
                        <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => {
                        const latestCheckin = getLatestCheckin(student.id)
                        const status = getRiskStatus(latestCheckin)
                        const StatusIcon = status.icon

                        return (
                            <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.avatar_url} />
                                            <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                                                {student.full_name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-slate-900">{student.full_name}</div>
                                            <div className="text-xs text-slate-500">{student.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {latestCheckin ? new Date(latestCheckin.month_year).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '-'}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">
                                    {latestCheckin?.revenue
                                        ? `R$ ${latestCheckin.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${status.color} font-medium border gap-1`}>
                                        {StatusIcon && <StatusIcon className="h-3 w-3" />}
                                        {status.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <button className="text-sm font-medium text-slate-900 hover:underline">
                                        Ver Detalhes
                                    </button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
