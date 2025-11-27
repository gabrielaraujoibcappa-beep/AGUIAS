'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, role: 'mentor' | 'student') {
    const supabase = await createClient()

    // Check if requester is admin/mentor (for now, let's assume any mentor can do this, or we'll add an 'admin' role later)
    // Ideally, we should have a stricter check here.

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin')
}

export async function linkStudentToMentor(studentId: string, mentorId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('relationships')
        .insert({ student_id: studentId, mentor_id: mentorId })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin')
}
