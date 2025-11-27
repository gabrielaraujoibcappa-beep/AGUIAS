import { CheckCircle2, Circle } from 'lucide-react'

export function PendingGoals({ latestCheckin }: { latestCheckin: any }) {
    if (!latestCheckin) return null

    // Parse goals from the text area (assuming they might be newline separated or just a block of text)
    // For this MVP, we'll just display the text block nicely or split by newlines if possible.
    const goals = latestCheckin.next_month_goals
        ? latestCheckin.next_month_goals.split('\n').filter((g: string) => g.trim().length > 0)
        : []

    return (
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm h-full">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Metas do Mês</h3>
                <p className="text-sm text-slate-500">Definidas no último check-in</p>
            </div>

            <div className="space-y-4">
                {goals.length > 0 ? (
                    goals.map((goal: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                            <Circle className="h-5 w-5 text-slate-300 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 text-sm leading-relaxed">{goal}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 text-sm italic">Nenhuma meta definida.</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Meta de Faturamento</span>
                    <span className="font-bold text-slate-900">
                        R$ {latestCheckin.next_month_revenue_goal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                </div>
            </div>
        </div>
    )
}
