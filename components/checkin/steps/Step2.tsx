import { UseFormReturn } from 'react-hook-form'
import { CheckinFormData } from '@/lib/validations/checkin'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function Step2({ form }: { form: UseFormReturn<CheckinFormData> }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <FormField
                control={form.control}
                name="month_summary"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Como foi o mês passado? (Resumo geral)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Conte os pontos altos e baixos..."
                                className="resize-none"
                                rows={4}
                                {...field}
                                value={field.value ?? ''}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid gap-6 md:grid-cols-1">
                <FormField
                    control={form.control}
                    name="challenges_financial"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desafios Financeiros</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ex: Fluxo de caixa, inadimplência..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="challenges_time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desafios de Tempo/Rotina</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ex: Procrastinação, falta de foco..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="challenges_processes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desafios de Processos</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ex: Falta de padrão, erros operacionais..."
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
