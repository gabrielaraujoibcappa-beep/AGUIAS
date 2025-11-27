import { ArrowUp, ArrowDown, DollarSign, TrendingUp, ShoppingBag, Wallet } from 'lucide-react'

export function KPIGrid({ latestCheckin }: { latestCheckin: any }) {
    if (!latestCheckin) return null

    const kpis = [
        {
            title: 'Faturamento',
            value: latestCheckin.revenue,
            prefix: 'R$ ',
            icon: DollarSign,
            color: 'text-slate-900',
        },
        {
            title: 'Lucro Líquido',
            value: latestCheckin.profit,
            prefix: 'R$ ',
            icon: Wallet,
            color: latestCheckin.profit >= 0 ? 'text-emerald-600' : 'text-red-600',
        },
        {
            title: 'Despesas',
            value: latestCheckin.fixed_expenses + latestCheckin.variable_expenses,
            prefix: 'R$ ',
            icon: ArrowDown,
            color: 'text-slate-900',
        },
        {
            title: 'Vendas',
            value: latestCheckin.sales_count,
            prefix: '',
            icon: ShoppingBag,
            color: 'text-slate-900',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
                <div key={kpi.title} className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {kpi.title}
                        </span>
                        <kpi.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
                        {kpi.prefix}{kpi.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                    </div>
                </div>
            ))}
        </div>
    )
}
