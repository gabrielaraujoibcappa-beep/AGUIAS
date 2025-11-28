import Link from 'next/link'

export default function Home() {
  const routes = [
    { name: 'Dashboard', path: '/dashboard', description: 'Painel principal', color: 'bg-blue-600' },
    { name: 'Admin', path: '/admin', description: 'Área administrativa', color: 'bg-purple-600' },
    { name: 'Mentor', path: '/mentor', description: 'Área do mentor', color: 'bg-green-600' },
    { name: 'Check-in', path: '/checkin', description: 'Realizar check-in', color: 'bg-orange-600' },
    { name: 'Login', path: '/login', description: 'Entrar na conta', color: 'bg-indigo-600' },
    { name: 'Cadastro', path: '/signup', description: 'Criar nova conta', color: 'bg-teal-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Quiz Mentoria
          </h1>
          <p className="text-slate-300 text-lg">
            Selecione uma página para navegar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >


              <div className="relative p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${route.color} mb-4 shadow-lg`}>
                  <span className="text-white text-2xl font-bold">
                    {route.name.charAt(0)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {route.name}
                </h2>

                <p className="text-slate-400 text-sm">
                  {route.description}
                </p>

                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Acessar
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Desenvolvido com Next.js e Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}
