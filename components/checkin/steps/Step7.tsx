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
import { Checkbox } from '@/components/ui/checkbox'

export function Step7({ form }: { form: UseFormReturn<CheckinFormData> }) {
    const tools = ['Google Agenda', 'Notion/Trello', 'CRM', 'IA (ChatGPT/Gemini)', 'Nenhuma']

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <FormField
                control={form.control}
                name="hours_dedicated_daily"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Horas dedicadas por dia</FormLabel>
                        <FormControl>
                            <Input type="number" max={24} {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormItem>
                <FormLabel>Ferramentas Utilizadas</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => (
                        <FormField
                            key={tool}
                            control={form.control}
                            name="tools_used"
                            render={({ field }) => {
                                return (
                                    <FormItem
                                        key={tool}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(tool)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), tool])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== tool
                                                            )
                                                        )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {tool}
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
                name="biggest_learning"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maior Aprendizado do Mês</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="O que você aprendeu que mudou o jogo?"
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
    )
}
