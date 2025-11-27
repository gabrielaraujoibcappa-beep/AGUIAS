'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

export function ConfidenceChart({ data }: { data: any[] }) {
    // Format data for chart
    const chartData = data.map((item) => {
        const date = new Date(item.month_year)
        return {
            name: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            revenue: item.revenue,
            profit: item.profit,
        }
    })

    return (
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm h-[400px]">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Evolução Financeira</h3>
                <p className="text-sm text-slate-500">Faturamento vs Lucro (Últimos meses)</p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#f8fafc'
                        }}
                        itemStyle={{ color: '#f8fafc' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Faturamento"
                        stroke="#0f172a"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#0f172a' }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="profit"
                        name="Lucro"
                        stroke="#059669"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#059669' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
