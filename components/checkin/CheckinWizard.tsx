'use client'

import * as React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkinSchema, CheckinFormData } from '@/lib/validations/checkin'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Form } from '@/components/ui/form'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import { Step3 } from './steps/Step3'
import { Step4 } from './steps/Step4'
import { Step5 } from './steps/Step5'
import { Step6 } from './steps/Step6'
import { Step7 } from './steps/Step7'
import { Step8 } from './steps/Step8'
import { Step9 } from './steps/Step9'

interface Step {
    id: number
    title: string
    component: React.ComponentType<{ form: UseFormReturn<CheckinFormData> }>
    fields: (keyof CheckinFormData)[]
}

const steps: Step[] = [
    { id: 1, title: 'Período', component: Step1, fields: ['month', 'year'] },
    { id: 2, title: 'Reflexão', component: Step2, fields: ['month_summary'] },
    { id: 3, title: 'Financeiro', component: Step3, fields: ['revenue', 'fixed_expenses', 'variable_expenses', 'profit', 'sales_count'] },
    { id: 4, title: 'Alcance', component: Step4, fields: ['traffic_invested'] },
    { id: 5, title: 'Voz Online', component: Step5, fields: ['posts_instagram'] },
    { id: 6, title: 'Plano', component: Step6, fields: ['action_plan_status', 'next_month_goals'] },
    { id: 7, title: 'Produtividade', component: Step7, fields: ['hours_dedicated_daily'] },
    { id: 8, title: 'IA', component: Step8, fields: ['ai_prompts_used'] },
    { id: 9, title: 'Apoio', component: Step9, fields: [] },
]

export function CheckinWizard() {
    const [currentStep, setCurrentStep] = React.useState(1)
    const [storedData, setStoredData] = useLocalStorage<Partial<CheckinFormData>>('checkin-form-draft', {})
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<CheckinFormData>({
        resolver: zodResolver(checkinSchema) as any,
        defaultValues: {
            traffic_invested: false,
            content_calendar_used: false,
            ai_prompts_used: false,
            ...storedData,
        },
        mode: 'onChange',
    })

    // Auto-save effect
    React.useEffect(() => {
        const subscription = form.watch((value) => {
            setStoredData(value as Partial<CheckinFormData>)
        })
        return () => subscription.unsubscribe()
    }, [form, setStoredData])

    const nextStep = async () => {
        const fields = steps[currentStep - 1].fields
        // Cast fields to any to avoid strict type checking on the dynamic steps array
        const isValid = await form.trigger(fields as any, { shouldFocus: true })

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
            window.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
        window.scrollTo(0, 0)
    }

    const onSubmit = async (data: CheckinFormData) => {
        try {
            console.log('Starting submission...')
            console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError) {
                console.error('Auth error:', authError)
                throw authError
            }

            if (!user) {
                console.error('No user found')
                throw new Error('User not authenticated')
            }

            console.log('User authenticated:', user.id)

            const { month, year, ...checkinData } = data
            const dateStr = `${year}-${month.padStart(2, '0')}-01`

            const payload = {
                student_id: user.id,
                month_year: dateStr,
                ...checkinData,
            }

            console.log('Payload:', payload)

            const { error, data: insertData } = await supabase.from('checkins').insert(payload).select()

            if (error) {
                console.error('Insert error object:', error)
                console.error('Insert error code:', error.code)
                console.error('Insert error message:', error.message)
                console.error('Insert error details:', error.details)
                console.error('Insert error hint:', error.hint)
                throw error
            }

            console.log('Insert success:', insertData)

            setStoredData({})
            router.push('/dashboard')

        } catch (error: any) {
            console.error('Error submitting checkin:', error)
            console.error('Error message:', error?.message)
            console.error('Error stack:', error?.stack)
            if (typeof error === 'object' && error !== null) {
                console.error('Error details:', JSON.stringify(error, null, 2))
            }
            alert(`Erro ao enviar check-in: ${error?.message || 'Erro desconhecido'}`)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component
    const progress = (currentStep / steps.length) * 100

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8 space-y-4">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Passo {currentStep} de {steps.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1 bg-slate-100" />
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{steps[currentStep - 1].title}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200 min-h-[400px]">
                        <CurrentStepComponent form={form} />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        >
                            Voltar
                        </Button>

                        {currentStep < steps.length ? (
                            <Button type="button" onClick={nextStep} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]">
                                Próximo
                            </Button>
                        ) : (
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
                                Enviar Check-in
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
