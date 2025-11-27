import { UseFormReturn } from 'react-hook-form'
import { CheckinFormData } from '@/lib/validations/checkin'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function Step6({ form }: { form: UseFormReturn<CheckinFormData> }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <FormField
                control={form.control}
                name="action_plan_status"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Execução do Plano Anterior</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="100%" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Realizei 100%
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Parcialmente" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Realizei Parcialmente
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="Não realizei" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Não realizei
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="action_plan_execution_details"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detalhes da Execução</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="O que funcionou? O que falhou?"
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

            <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Próximo Mês</h3>
                <FormField
                    control={form.control}
                    name="next_month_goals"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metas Principais</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Liste suas 3 prioridades..."
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
                    name="next_month_revenue_goal"
                    render={({ field }) => (
                        <FormItem className="mt-4">
                            <FormLabel>Meta de Faturamento (R$)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                                    <Input type="number" step="0.01" className="pl-9" {...field} value={field.value ?? ''} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confidence_level"
                    render={({ field }) => (
                        <FormItem className="mt-4">
                            <FormLabel>Nível de Confiança (1-10)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <p className="text-xs text-slate-500">
                                Quão confiante você está em atingir essas metas?
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
