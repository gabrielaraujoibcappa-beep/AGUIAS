import { forgotPassword } from '@/app/login/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Rocket, ArrowLeft } from "lucide-react"
import Link from 'next/link'

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column: Brand/Aesthetic */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <Rocket className="h-6 w-6" />
                        <span>AGUIAS</span>
                    </div>
                </div>
                <div className="relative z-10 max-w-md">
                    <blockquote className="text-2xl font-medium leading-relaxed">
                        &quot;A persistência é o caminho do êxito.&quot;
                    </blockquote>
                    <footer className="mt-4 text-slate-400 font-medium">— Charles Chaplin</footer>
                </div>
                <div className="relative z-10 text-xs text-slate-500">
                    &copy; 2025 Aguias Mentoria. All rights reserved.
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Recuperar senha
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Digite seu email para receber um link de redefinição.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    required
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                                />
                            </div>
                        </div>

                        <Button
                            formAction={forgotPassword}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11"
                        >
                            Enviar link de recuperação
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
