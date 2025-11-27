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

export function Step3({ form }: { form: UseFormReturn<CheckinFormData> }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="revenue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Faturamento Total (R$)</FormLabel>
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
                    name="profit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lucro Líquido (R$)</FormLabel>
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
                    name="fixed_expenses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Despesas Fixas (R$)</FormLabel>
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
                    name="variable_expenses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Despesas Variáveis (R$)</FormLabel>
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
                    name="sales_count"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Vendas</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
