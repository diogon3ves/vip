// pages/pagamento.tsx
import { useState } from 'react'
import Link from 'next/link'

// Definições de cores e estilos para cada plano
const cardHeaderClasses: Record<string, string> = {
  basic: 'bg-gray-800',
  pro: 'bg-indigo-600',
  premium: 'bg-purple-600'
}
const valueClasses: Record<string, string> = {
  basic: 'text-gray-900',
  pro: 'text-indigo-800',
  premium: 'text-purple-800'
}
const buttonClasses: Record<string, string> = {
  basic: 'bg-gray-900 text-white hover:bg-gray-700',
  pro: 'bg-indigo-600 text-white hover:bg-indigo-500',
  premium: 'bg-purple-600 text-white hover:bg-purple-500'
}

type Plano = {
  id: string
  nome: string
  preco: number
  features: { icon: string; text: string }[]
}

export default function Pagamento() {
  const planos: Plano[] = [
    {
      id: 'basic',
      nome: 'Básico',
      preco: 30,
      features: [
        { icon: '🎯', text: 'R$ 40,00 por indicação' },
        { icon: '🤝', text: 'Acesso ao grupo VIP' },
        { icon: '🎁', text: 'Bônus R$ 10,00 na plataforma' }
      ]
    },
    {
      id: 'pro',
      nome: 'Pro',
      preco: 50,
      features: [
        { icon: '🚀', text: 'R$ 60,00 por indicação' },
        { icon: '🛠️', text: 'Acesso VIP + material de ajuda' },
        { icon: '💎', text: 'Bônus R$ 20,00 na plataforma' }
      ]
    },
    {
      id: 'premium',
      nome: 'Premium',
      preco: 100,
      features: [
        { icon: '👑', text: 'R$ 80,00 por indicação' },
        { icon: '🎥', text: 'Acesso vitalício a vídeos e materiais' },
        { icon: '🏆', text: 'Bônus R$ 50,00 na plataforma' }
      ]
    }
  ]

  const [planoSelecionado, setPlanoSelecionado] = useState(planos[0].id)
  const [assinando, setAssinando] = useState(false)
  const plano = planos.find(p => p.id === planoSelecionado)!

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Menu lateral */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">LOGO</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/painel"><a className="text-gray-700 hover:text-gray-900">Painel</a></Link>
          <Link href="/dados"><a className="text-gray-700 hover:text-gray-900">Meus Dados</a></Link>
          <Link href="/links"><a className="text-gray-700 hover:text-gray-900">Links</a></Link>
          <Link href="/relatorio"><a className="text-gray-700 hover:text-gray-900">Relatório</a></Link>
          <Link href="/saque"><a className="text-gray-700 hover:text-gray-900">Saque</a></Link>
          <Link href="/pagamento"><a className="text-gray-900 font-bold">Assinatura</a></Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Selecione seu plano</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map(p => {
            const isActive = planoSelecionado === p.id
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setPlanoSelecionado(p.id)}
                className={`cursor-pointer flex flex-col rounded-xl shadow-lg transform hover:scale-105 transition relative bg-white overflow-hidden ${
                  isActive ? 'ring-4 ring-indigo-400' : ''
                }`}
              >
                {/* Header colorido */}
                <div className={`p-6 ${cardHeaderClasses[p.id]}`}>                  
                  <h2 className="text-2xl font-bold text-white">{p.nome}</h2>
                </div>

                {/* Conteúdo do card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <ul className="space-y-4">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center text-lg text-gray-700 gap-3">
                        <span className="text-xl">{f.icon}</span>
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className={`mt-8 text-3xl font-extrabold ${valueClasses[p.id]}`}>R$ {p.preco.toFixed(2)}/mês</p>
                    <button
                      onClick={() => setAssinando(true)}
                      className={`mt-6 w-full py-3 rounded-lg font-semibold ${buttonClasses[p.id]} transition transform hover:scale-105`}
                    >
                      Assinar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Slide-over */}
        {assinando && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
            <div className="w-full md:w-1/3 bg-white h-full shadow-xl p-8 overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Confirmar Assinatura</h2>
                <button onClick={() => setAssinando(false)} className="text-gray-500 hover:text-gray-800 text-2xl">×</button>
              </div>

              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <p className="font-semibold text-lg">Plano: <span className="font-normal">{plano.nome}</span></p>
                <p className="font-semibold text-lg mt-2">Valor: <span className={`font-normal ${valueClasses[plano.id]}`}>R$ {plano.preco.toFixed(2)}/mês</span></p>
              </div>

              <div className="mb-6">
                <p className="font-semibold mb-2 text-lg">Forma de pagamento</p>
                <select className="w-full border rounded px-4 py-3">
                  <option>Cartão de Crédito</option>
                  <option>PIX</option>
                  <option>Boleto</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setAssinando(false)}
                  className="flex-1 py-3 rounded-lg font-semibold border border-red-500 text-red-500 hover:bg-red-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setAssinando(false)
                    alert(`Assinatura no plano “${plano.nome}” ativada!`)
                  }}
                  className="flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-500 transition"
                >
                  Confirmar assinatura
                </button>
              </div>

              <p className="mt-6 text-sm text-red-600">Sua assinatura será processada em até 30 minutos.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
