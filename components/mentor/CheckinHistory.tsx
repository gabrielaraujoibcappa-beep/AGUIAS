import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react"
import { FeedbackForm } from "./FeedbackForm"

interface CheckinHistoryProps {
    checkins: any[]
    isMentor?: boolean
    studentId?: string
}

export function CheckinHistory({ checkins, isMentor = false, studentId }: CheckinHistoryProps) {
    if (checkins.length === 0) {
        return (
            <Card className="border-slate-200 shadow-sm bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-slate-500">Nenhum check-in realizado ainda.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Histórico de Check-ins</h3>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {checkins.map((checkin, index) => {
                    const previousCheckin = checkins[index + 1]
                    const revenueGrowth = previousCheckin
                        ? ((checkin.revenue - previousCheckin.revenue) / previousCheckin.revenue) * 100
                        : 0

                    return (
                        <AccordionItem key={checkin.id} value={checkin.id} className="border border-slate-200 rounded-lg bg-white px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-bold text-slate-900 capitalize">
                                                {format(new Date(checkin.month_year + 'T12:00:00'), 'MMMM yyyy', { locale: ptBR })}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Enviado em {format(new Date(checkin.created_at), "dd 'de' MMM", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-medium text-slate-500">Faturamento</div>
                                            <div className="font-mono font-bold text-slate-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.revenue)}
                                            </div>
                                        </div>

                                        <div className="hidden sm:flex items-center gap-1 w-20 justify-end">
                                            {previousCheckin ? (
                                                <>
                                                    {revenueGrowth > 0 ? (
                                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                    ) : revenueGrowth < 0 ? (
                                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <Minus className="h-4 w-4 text-slate-400" />
                                                    )}
                                                    <span className={`text-sm font-bold ${revenueGrowth > 0 ? 'text-emerald-600' :
                                                        revenueGrowth < 0 ? 'text-red-600' : 'text-slate-500'
                                                        }`}>
                                                        {Math.abs(revenueGrowth).toFixed(1)}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400">Ref.</span>
                                            )}
                                        </div>

                                        <Badge variant="outline" className={`
                                            ${checkin.confidence_level >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                checkin.confidence_level >= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}
                                        `}>
                                            Confiança: {checkin.confidence_level}/10
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6 border-t border-slate-100 mt-2">
                                <div className="space-y-8">
                                    {/* 1. Reflexão Inicial */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                            Reflexão Inicial
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <span className="text-xs text-slate-500 block mb-1">Resumo do Mês</span>
                                                <p className="text-sm text-slate-800 whitespace-pre-wrap">{checkin.month_summary || '-'}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <span className="text-xs text-slate-500 block mb-1">Desafios Financeiros</span>
                                                    <p className="text-sm text-slate-800">{checkin.challenges_financial || '-'}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <span className="text-xs text-slate-500 block mb-1">Desafios de Tempo</span>
                                                    <p className="text-sm text-slate-800">{checkin.challenges_time || '-'}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <span className="text-xs text-slate-500 block mb-1">Desafios de Processos</span>
                                                    <p className="text-sm text-slate-800">{checkin.challenges_processes || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 2. Financeiro */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                            Saúde Financeira
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg">
                                            <div>
                                                <span className="text-xs text-slate-500">Faturamento</span>
                                                <p className="font-mono font-bold text-slate-900">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.revenue)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Lucro Líquido</span>
                                                <p className="font-mono font-bold text-emerald-700">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.profit)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Despesas Fixas</span>
                                                <p className="font-mono font-medium text-slate-700">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.fixed_expenses)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Despesas Variáveis</span>
                                                <p className="font-mono font-medium text-slate-700">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.variable_expenses)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Nº Vendas</span>
                                                <p className="font-mono font-bold text-slate-900">{checkin.sales_count || 0}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 3. Tráfego & Conversão */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                            Tráfego e Conversão
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            {checkin.traffic_invested ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    <div>
                                                        <span className="text-xs text-slate-500">Investimento</span>
                                                        <p className="font-mono font-bold text-slate-900">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.traffic_amount)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-slate-500">Campanhas Ativas</span>
                                                        <p className="font-medium text-slate-900">{checkin.active_campaigns || 0}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-slate-500">Leads/Vendas</span>
                                                        <p className="font-medium text-slate-900">{checkin.leads_sales_traffic || 0}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-slate-500">Plataformas</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {checkin.traffic_platforms && checkin.traffic_platforms.length > 0 ? (
                                                                checkin.traffic_platforms.map((p: string) => (
                                                                    <Badge key={p} variant="secondary" className="text-[10px] bg-white border border-slate-200">{p}</Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-slate-400">-</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 italic">Não investiu em tráfego este mês.</p>
                                            )}
                                        </div>
                                    </section>

                                    {/* 4. Presença Digital */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                                            Presença Digital
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg">
                                            <div>
                                                <span className="text-xs text-slate-500">Posts Feed</span>
                                                <p className="font-bold text-slate-900">{checkin.posts_instagram || 0}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Stories</span>
                                                <p className="font-bold text-slate-900">{checkin.stories_instagram || 0}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Vídeos</span>
                                                <p className="font-bold text-slate-900">{checkin.videos_posted || 0}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Interações Diárias</span>
                                                <p className="font-bold text-slate-900">{checkin.daily_interactions || 0}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Calendário Editorial</span>
                                                <p className="font-medium text-slate-900">{checkin.content_calendar_used ? 'Sim ✅' : 'Não ❌'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 5. Planejamento & Metas */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                            Planejamento
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                                <div>
                                                    <span className="text-xs text-slate-500">Execução do Plano Anterior</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="bg-white">{checkin.action_plan_status}</Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Detalhes da Execução</span>
                                                    <p className="text-sm text-slate-800">{checkin.action_plan_execution_details || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                                <div>
                                                    <span className="text-xs text-slate-500">Meta Faturamento (Próx. Mês)</span>
                                                    <p className="font-mono font-bold text-slate-900 mt-1">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(checkin.next_month_revenue_goal || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Metas Principais</span>
                                                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{checkin.next_month_goals || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 6. Produtividade & IA */}
                                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                                Produtividade
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                                                <div>
                                                    <span className="text-xs text-slate-500">Horas Dedicadas/Dia</span>
                                                    <p className="font-bold text-slate-900">{checkin.hours_dedicated_daily || 0}h</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500">Ferramentas Usadas</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {checkin.tools_used && checkin.tools_used.length > 0 ? (
                                                            checkin.tools_used.map((t: string) => (
                                                                <Badge key={t} variant="secondary" className="text-[10px] bg-white border border-slate-200">{t}</Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-slate-400">-</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Maior Aprendizado</span>
                                                    <p className="text-sm text-slate-800">{checkin.biggest_learning || '-'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                                Uso de IA
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                                                {checkin.ai_prompts_used ? (
                                                    <>
                                                        <div>
                                                            <span className="text-xs text-slate-500">Áreas de Aplicação</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {checkin.ai_areas && checkin.ai_areas.length > 0 ? (
                                                                    checkin.ai_areas.map((a: string) => (
                                                                        <Badge key={a} variant="secondary" className="text-[10px] bg-white border border-slate-200">{a}</Badge>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-sm text-slate-400">-</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-slate-500 block mb-1">Ganhos com IA</span>
                                                            <p className="text-sm text-slate-800">{checkin.ai_gains || '-'}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic">Não utilizou IA este mês.</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* 7. Apoio e Desenvolvimento */}
                                    <section>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                            Apoio e Desenvolvimento
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Habilidades a Desenvolver</span>
                                                    <p className="text-sm text-slate-800">{checkin.skills_to_develop || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Fatores Desmotivadores</span>
                                                    <p className="text-sm text-slate-800">{checkin.demotivators || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Fatores Externos</span>
                                                    <p className="text-sm text-slate-800">{checkin.external_factors || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Participação no WhatsApp</span>
                                                    <p className="text-sm text-slate-800">{checkin.whatsapp_participation || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Apoio Necessário</span>
                                                    <p className="text-sm text-slate-800 font-medium text-amber-700">{checkin.support_needed || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block mb-1">Feedback para Mentoria</span>
                                                    <p className="text-sm text-slate-800">{checkin.feedback || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 8. Feedback do Mentor */}
                                    <section className="pt-6 border-t border-slate-200">
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                                            Feedback do Mentor
                                        </h4>

                                        {checkin.checkin_feedback && checkin.checkin_feedback.length > 0 ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    Feedback Enviado
                                                </div>
                                                <p className="text-sm text-emerald-700">
                                                    Você já enviou o feedback para este check-in.
                                                </p>
                                                <div className="mt-4 text-sm text-slate-600 bg-white p-3 rounded border border-emerald-100">
                                                    {checkin.checkin_feedback[0].content}
                                                </div>
                                            </div>
                                        ) : isMentor && studentId ? (
                                            <FeedbackForm checkinId={checkin.id} studentId={studentId} />
                                        ) : (
                                            <div className="text-sm text-slate-500 italic">
                                                Ainda sem feedback registrado.
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}
