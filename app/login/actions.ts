'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        console.log('Login successful for user:', user.id)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        console.log('User profile role:', profile?.role)

        revalidatePath('/', 'layout')

        if (profile?.role === 'mentor') {
            console.log('Redirecting to /mentor')
            redirect('/mentor')
        } else if (profile?.role === 'admin') {
            console.log('Redirecting to /admin')
            redirect('/admin')
        } else {
            console.log('Redirecting to /dashboard')
            redirect('/dashboard')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/signup?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/dashboard/reset-password`,
    })

    if (error) {
        redirect('/forgot-password?error=' + encodeURIComponent(error.message))
    }

    redirect('/login?message=Verifique seu email para redefinir sua senha')
}
