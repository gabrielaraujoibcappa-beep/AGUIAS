import { signup } from '@/app/login/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Rocket } from "lucide-react"
import Link from 'next/link'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column: Brand/Aesthetic */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <Rocket className="h-6 w-6" />
                        <span>VIBE MENTORIA</span>
                    </div>
                </div>
                <div className="relative z-10 max-w-md">
                    <blockquote className="text-2xl font-medium leading-relaxed">
                        "A melhor maneira de prever o futuro é criá-lo."
                    </blockquote>
                    <footer className="mt-4 text-slate-400 font-medium">— Peter Drucker</footer>
                </div>
                <div className="relative z-10 text-xs text-slate-500">
                    &copy; 2024 Vibe Mentoria. All rights reserved.
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Crie sua conta
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Comece sua jornada de transformação hoje mesmo.
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
                                <Label htmlFor="full_name">Nome Completo</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="Seu nome"
                                    required
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                                />
                            </div>
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
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                formAction={signup}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11"
                            >
                                Criar Conta
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-slate-500">Já tem uma conta? </span>
                                <Link href="/login" className="font-medium text-slate-900 hover:underline">
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
