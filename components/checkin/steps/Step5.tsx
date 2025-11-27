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
import { Checkbox } from '@/components/ui/checkbox'

export function Step5({ form }: { form: UseFormReturn<CheckinFormData> }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="posts_instagram"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Posts no Feed</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stories_instagram"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stories Publicados</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="videos_posted"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vídeos (Reels/YouTube)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="daily_interactions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interações Diárias (Média)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="content_calendar_used"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Calendário Editorial</FormLabel>
                            <div className="text-sm text-gray-500">
                                Você seguiu um planejamento de conteúdo?
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
        </div>
    )
}
