'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Loader2, Send } from "lucide-react"
import { submitFeedback } from '@/app/mentor/actions'

interface FeedbackFormProps {
    checkinId: string
    studentId: string
    onSuccess?: () => void
}

export function FeedbackForm({ checkinId, studentId, onSuccess }: FeedbackFormProps) {
    const [content, setContent] = useState('')
    const [guidelines, setGuidelines] = useState<string[]>([])
    const [newGuideline, setNewGuideline] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAddGuideline = () => {
        if (newGuideline.trim()) {
            setGuidelines([...guidelines, newGuideline.trim()])
            setNewGuideline('')
        }
    }

    const handleRemoveGuideline = (index: number) => {
        setGuidelines(guidelines.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            await submitFeedback(checkinId, studentId, content, guidelines)
            setContent('')
            setGuidelines([])
            if (onSuccess) onSuccess()
            alert('Feedback enviado com sucesso!')
        } catch (error) {
            console.error(error)
            alert('Erro ao enviar feedback.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-slate-200 mt-6">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar Feedback
            </h4>

            <div className="space-y-2">
                <Label htmlFor="feedback-content">Análise Geral</Label>
                <Textarea
                    id="feedback-content"
                    placeholder="Escreva sua análise sobre o desempenho do aluno..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] bg-white"
                />
            </div>

            <div className="space-y-3">
                <Label>Diretrizes / Próximos Passos</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Adicionar uma tarefa ou diretriz..."
                        value={newGuideline}
                        onChange={(e) => setNewGuideline(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddGuideline()}
                        className="bg-white"
                    />
                    <Button type="button" onClick={handleAddGuideline} variant="outline">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {guidelines.length > 0 && (
                    <ul className="space-y-2 mt-2">
                        {guidelines.map((g, i) => (
                            <li key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm">
                                <span>{g}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveGuideline(i)}
                                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Feedback & Notificar
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
