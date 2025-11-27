import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowLeft, Calendar } from "lucide-react"
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckinHistory } from '@/components/mentor/CheckinHistory' // Reusing this for the summary view

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch checkin details
    const { data: checkin, error: checkinError } = await supabase
        .from('checkins')
        .select('*')
        .eq('id', id)
        .single()

    if (checkinError || !checkin) {
        return <div>Check-in não encontrado.</div>
    }

    // Fetch feedback
    const { data: feedback } = await supabase
        .from('checkin_feedback')
        .select('*, mentor:mentor_id(full_name, avatar_url)')
        .eq('checkin_id', id)
        .single()

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Feedback da Mentoria</h1>
                        <p className="text-slate-500 text-sm">
                            Referente ao mês de {format(new Date(checkin.month_year + 'T12:00:00'), 'MMMM yyyy', { locale: ptBR })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Check-in Summary */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900">Seu Check-in</h2>
                        <div className="opacity-90 pointer-events-none">
                            {/* Reusing CheckinHistory but passing just this one checkin */}
                            <CheckinHistory checkins={[checkin]} />
                        </div>
                    </div>

                    {/* Right Column: Mentor Feedback */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-900">Resposta do Mentor</h2>

                        {feedback ? (
                            <Card className="border-l-4 border-l-slate-900 border-y-slate-200 border-r-slate-200 shadow-sm bg-white">
                                <CardHeader className="pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-slate-100">
                                            <AvatarImage src={feedback.mentor?.avatar_url} />
                                            <AvatarFallback>M</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">
                                                {feedback.mentor?.full_name || 'Mentor'}
                                            </CardTitle>
                                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {format(new Date(feedback.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="prose prose-slate prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                            {feedback.content}
                                        </p>
                                    </div>

                                    {feedback.guidelines && feedback.guidelines.length > 0 && (
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <h4 className="text-xs font-bold uppercase text-slate-900 mb-3">
                                                Novas Diretrizes
                                            </h4>
                                            <ul className="space-y-2">
                                                {feedback.guidelines.map((item: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <form action={async () => {
                                            'use server'
                                            const supabase = await createClient()
                                            await supabase
                                                .from('checkin_feedback')
                                                .update({ read_at: new Date().toISOString() })
                                                .eq('id', feedback.id)
                                        }}>
                                            <Button
                                                type="submit"
                                                disabled={!!feedback.read_at}
                                                className={feedback.read_at
                                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                                }
                                            >
                                                {feedback.read_at ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Lido em {format(new Date(feedback.read_at), "dd/MM", { locale: ptBR })}
                                                    </>
                                                ) : (
                                                    "Marcar como Lido"
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed border-slate-300 shadow-none bg-slate-50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <Calendar className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <h3 className="font-medium text-slate-900">Aguardando Análise</h3>
                                    <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                        Seu mentor ainda não enviou o feedback para este check-in. Você será notificado quando estiver pronto.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
