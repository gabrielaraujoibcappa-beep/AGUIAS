'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Goal {
    id: string
    title: string
    status: 'pending' | 'completed'
    created_at: string
}

export function ActionPlanWidget() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [newGoal, setNewGoal] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('student_id', user.id)
                .order('status', { ascending: false }) // Pending first (descending string order: pending > completed)
                .order('created_at', { ascending: false })

            if (!error && data) {
                // Sort manually to be sure: pending first, then by date
                const sorted = data.sort((a, b) => {
                    if (a.status === b.status) {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    }
                    return a.status === 'pending' ? -1 : 1
                })
                setGoals(sorted)
            }
        }
        setIsLoading(false)
    }

    const handleAddGoal = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newGoal.trim()) return

        setIsAdding(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data, error } = await supabase
                .from('goals')
                .insert({
                    student_id: user.id,
                    title: newGoal,
                    status: 'pending'
                })
                .select()
                .single()

            if (!error && data) {
                setGoals([data, ...goals])
                setNewGoal('')
            }
        }
        setIsAdding(false)
    }

    const toggleGoal = async (goal: Goal) => {
        const newStatus = goal.status === 'pending' ? 'completed' : 'pending'

        // Optimistic update
        const updatedGoals = goals.map(g =>
            g.id === goal.id ? { ...g, status: newStatus } : g
        ).sort((a, b) => {
            if (a.status === b.status) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
            return a.status === 'pending' ? -1 : 1
        })
        setGoals(updatedGoals)

        const { error } = await supabase
            .from('goals')
            .update({ status: newStatus })
            .eq('id', goal.id)

        if (error) {
            // Revert if error
            fetchGoals()
        }
    }

    const deleteGoal = async (id: string) => {
        // Optimistic update
        setGoals(goals.filter(g => g.id !== id))

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) {
            fetchGoals()
        }
    }

    const currentMonth = format(new Date(), 'MMMM', { locale: ptBR })

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Plano de Ação</h3>
                    <p className="text-xs text-slate-500 capitalize">{currentMonth}</p>
                </div>
                <div className="text-xs font-medium text-slate-400">
                    {goals.filter(g => g.status === 'pending').length} pendentes
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px] p-2 space-y-1 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-sm text-slate-500 mb-2">Nenhuma meta definida.</p>
                        <p className="text-xs text-slate-400">Adicione suas prioridades para o mês.</p>
                    </div>
                ) : (
                    goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`group flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${goal.status === 'completed' ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'
                                }`}
                        >
                            <Checkbox
                                checked={goal.status === 'completed'}
                                onCheckedChange={() => toggleGoal(goal)}
                                className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                            />
                            <span className={`flex-1 text-sm ${goal.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'
                                }`}>
                                {goal.title}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteGoal(goal.id)}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/30">
                <form onSubmit={handleAddGoal} className="flex gap-2">
                    <Input
                        placeholder="Adicionar nova meta..."
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="h-9 bg-white border-slate-200 focus-visible:ring-slate-900"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isAdding || !newGoal.trim()}
                        className="h-9 w-9 p-0 bg-slate-900 hover:bg-slate-800 text-white shrink-0"
                    >
                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}
