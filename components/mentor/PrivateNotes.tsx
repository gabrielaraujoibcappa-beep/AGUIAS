'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area' // Assuming ScrollArea exists or I'll use div
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Save } from 'lucide-react'

interface Note {
    id: string
    note: string
    created_at: string
}

interface PrivateNotesProps {
    studentId: string
    mentorId: string
}

export function PrivateNotes({ studentId, mentorId }: PrivateNotesProps) {
    const [notes, setNotes] = useState<Note[]>([])
    const [currentNote, setCurrentNote] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchNotes()
    }, [studentId])

    const fetchNotes = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('mentor_notes')
            .select('*')
            .eq('student_id', studentId)
            .eq('mentor_id', mentorId)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setNotes(data)
        }
        setIsLoading(false)
    }

    const handleSave = async () => {
        if (!currentNote.trim()) return

        setIsSaving(true)
        const { data, error } = await supabase
            .from('mentor_notes')
            .insert({
                mentor_id: mentorId,
                student_id: studentId,
                note: currentNote
            })
            .select()
            .single()

        if (!error && data) {
            setNotes([data, ...notes])
            setCurrentNote('')
        }
        setIsSaving(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSave()
        }
    }

    return (
        <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Notas Privadas</h3>
                <span className="text-xs text-slate-500">Visível apenas para você</span>
            </div>

            <div className="space-y-2">
                <Textarea
                    placeholder="Digite uma nota sobre o aluno... (Ctrl+Enter para salvar)"
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[100px] resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving || !currentNote.trim()}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Salvar Nota
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                {isLoading ? (
                    <div className="text-center py-4 text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </div>
                ) : notes.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-4">Nenhuma nota registrada.</p>
                ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {notes.map((note) => (
                            <div key={note.id} className="bg-slate-50 p-3 rounded-md border border-slate-100 text-sm">
                                <p className="text-slate-700 whitespace-pre-wrap">{note.note}</p>
                                <p className="text-xs text-slate-400 mt-2 text-right">
                                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: ptBR })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
