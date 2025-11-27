'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Student {
    id: string
    full_name: string
    email: string
    avatar_url: string
    last_checkin?: {
        created_at: string
        revenue: number
        confidence_level: number
        month_year: string
    }
}

interface StudentsTableProps {
    students: Student[]
}

export function StudentsTable({ students }: StudentsTableProps) {
    return (
        <div className="rounded-md border border-slate-200 bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                        <TableHead className="w-[300px] text-xs font-bold uppercase text-slate-500">Aluno</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-slate-500">Status Check-in</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-slate-500">Tendência</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-slate-500">Confiança</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-slate-500">Última Atividade</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase text-slate-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-200">
                    {students.map((student) => {
                        const hasCheckin = !!student.last_checkin
                        const isLate = !hasCheckin // Simplification for now
                        const riskClass = isLate ? "border-l-4 border-l-red-500" : ""

                        return (
                            <TableRow key={student.id} className={`hover:bg-slate-50 transition-colors ${riskClass}`}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.avatar_url} />
                                            <AvatarFallback>{student.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{student.full_name}</span>
                                            <span className="text-xs text-slate-500">{student.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {hasCheckin ? (
                                        <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                                            Entregue
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-white border-red-200 text-red-700">
                                            Pendente
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {/* Mock trend for now */}
                                    <div className="flex items-center text-emerald-600 text-sm font-mono">
                                        <ArrowUpRight className="mr-1 h-4 w-4" />
                                        12%
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {hasCheckin ? (
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${student.last_checkin!.confidence_level >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {student.last_checkin!.confidence_level}/10
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {hasCheckin ? (
                                        formatDistanceToNow(new Date(student.last_checkin!.created_at), { addSuffix: true, locale: ptBR })
                                    ) : (
                                        'Nunca'
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/mentor/student/${student.id}`}>
                                        <Button variant="ghost" size="sm">
                                            Ver Detalhes
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
