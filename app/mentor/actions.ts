'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendFeedbackEmail } from '@/utils/send-email'

export async function submitFeedback(
    checkinId: string,
    studentId: string,
    content: string,
    guidelines: string[]
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 1. Save Feedback to Database
    const { data: feedback, error } = await supabase
        .from('checkin_feedback')
        .insert({
            checkin_id: checkinId,
            mentor_id: user.id,
            content,
            guidelines
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving feedback:', error)
        throw new Error('Failed to save feedback')
    }

    // 2. Fetch Student & Mentor Details for Email
    const { data: student } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', studentId)
        .single()

    const { data: mentor } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // 3. Send Email Notification
    if (student?.email && mentor?.full_name) {
        await sendFeedbackEmail(
            student.email,
            student.full_name || 'Aluno',
            mentor.full_name || 'Seu Mentor',
            content.substring(0, 100) // Preview
        )
    }

    // 4. Create In-App Notification
    await supabase
        .from('notifications')
        .insert({
            user_id: studentId,
            title: 'Novo Feedback Recebido',
            message: `Seu mentor enviou um feedback sobre o check-in.`,
            type: 'feedback',
            link: `/dashboard/feedback/${checkinId}`
        })

    revalidatePath(`/mentor/student/${studentId}`)
    return { success: true }
}
