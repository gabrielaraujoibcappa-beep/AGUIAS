import { UseFormReturn, useWatch } from 'react-hook-form'
import { CheckinFormData } from '@/lib/validations/checkin'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export function Step8({ form }: { form: UseFormReturn<CheckinFormData> }) {
    const usedAi = useWatch({
        control: form.control,
        name: 'ai_prompts_used',
    })

    const aiAreas = ['Criação de Conteúdo', 'Atendimento', 'Análise de Dados', 'Organização', 'Outros']

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <FormField
                control={form.control}
                name="ai_prompts_used"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Uso de IA</FormLabel>
                            <div className="text-sm text-gray-500">
                                Você utilizou Inteligência Artificial este mês?
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

            {usedAi && (
                <div className="space-y-6 pl-4 border-l-2 border-indigo-100">
                    <FormItem>
                        <FormLabel>Áreas de Aplicação</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {aiAreas.map((area) => (
                                <FormField
                                    key={area}
                                    control={form.control}
                                    name="ai_areas"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={area}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={(field.value || []).includes(area)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), area])
                                                                : field.onChange(
                                                                    (field.value || []).filter(
                                                                        (value) => value !== area
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {area}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="ai_gains"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Principais Ganhos</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Como a IA te ajudou? (Ex: Economizei 5h na criação de posts)"
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
                </div>
            )}
        </div>
    )
}
