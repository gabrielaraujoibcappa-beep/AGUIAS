import { UseFormReturn } from 'react-hook-form'
import { CheckinFormData } from '@/lib/validations/checkin'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function Step9({ form }: { form: UseFormReturn<CheckinFormData> }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-indigo-50 p-4 rounded-md mb-6">
                <h3 className="text-indigo-800 font-medium">Quase lá!</h3>
                <p className="text-indigo-600 text-sm">Este é o último passo. Suas respostas ajudarão a direcionar nossa próxima mentoria.</p>
            </div>

            <FormField
                control={form.control}
                name="skills_to_develop"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Habilidades a Desenvolver</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="O que você precisa aprender agora?"
                                className="resize-none"
                                rows={2}
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
                name="demotivators"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fatores Desmotivadores</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="O que te desanimou?"
                                className="resize-none"
                                rows={2}
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
                name="support_needed"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apoio Necessário</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Como posso te ajudar mais?"
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
