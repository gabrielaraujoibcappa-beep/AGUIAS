import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Rocket } from "lucide-react"
import Link from 'next/link'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const { error, message } = await searchParams

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column: Brand/Aesthetic */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <Rocket className="h-6 w-6" />
                        <span>AGUIAS</span>
                    </div>
                </div>
                <div className="relative z-10 max-w-md">
                    <blockquote className="text-2xl font-medium leading-relaxed">
                        "O sucesso não é um acidente. É trabalho duro, perseverança, aprendizado, estudo, sacrifício e, acima de tudo, amor pelo que você está fazendo."
                    </blockquote>
                    <footer className="mt-4 text-slate-400 font-medium">— Pelé</footer>
                </div>
                <div className="relative z-10 text-xs text-slate-500">
                    &copy; 2025 Aguias Mentoria. All rights reserved.
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Acesse sua conta
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Entre com suas credenciais para acessar o Control Tower.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm">
                            {message}
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
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                                        Esqueceu a senha?
                                    </a>
                                </div>
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

                        <Button
                            formAction={login}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11"
                        >
                            Entrar
                        </Button>
                    </form>

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Ou</span>
                            </div>
                        </div>

                        <Link href="/signup" className="w-full block">
                            <Button
                                variant="outline"
                                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-11"
                            >
                                Criar nova conta
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
