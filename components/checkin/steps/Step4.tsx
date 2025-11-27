import { UseFormReturn, useWatch } from 'react-hook-form'
import { CheckinFormData } from '@/lib/validations/checkin'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function Step4({ form }: { form: UseFormReturn<CheckinFormData> }) {
    const invested = useWatch({
        control: form.control,
        name: 'traffic_invested',
    })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <FormField
                control={form.control}
                name="traffic_invested"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Investimento em Tráfego</FormLabel>
                            <div className="text-sm text-gray-500">
                                Você investiu em anúncios pagos neste mês?
                            </div>
                        </div>
                        <FormControl>
                            <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {invested && (
                <div className="space-y-6 pl-4 border-l-2 border-indigo-100">
                    <FormField
                        control={form.control}
                        name="traffic_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor Investido (R$)</FormLabel>
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
                        name="active_campaigns"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Campanhas Ativas</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Note: traffic_platforms array handling would be a multi-select checkbox group here. 
               For simplicity, I'll skip the complex multi-select UI implementation for now 
               or just use a text input if acceptable, but the schema expects array.
               I'll implement a simple multi-checkbox for platforms.
           */}
                    <FormItem>
                        <FormLabel>Plataformas Utilizadas</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads'].map((platform) => (
                                <FormField
                                    key={platform}
                                    control={form.control}
                                    name="traffic_platforms"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={platform}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={(field.value || []).includes(platform)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), platform])
                                                                : field.onChange(
                                                                    (field.value || []).filter(
                                                                        (value) => value !== platform
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {platform}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                </div>
            )}
        </div>
    )
}
