import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getUsuarioAutenticado } from '../lib/auth';
import { supabase } from '@/lib/supabaseClient';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const usuarioToken = getUsuarioAutenticado(ctx.req);

  if (!usuarioToken) {
    console.warn('[Painel] Usuário não autenticado');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  console.log('[Painel] ID do usuário:', usuarioToken.id);

  const { data, error } = await supabase
    .from('"Usuario"') // ✅ com aspas e maiúsculo
    .select('nome')
    .eq('id', usuarioToken.id)
    .single();

  console.log('[Painel] Resultado Supabase:', { data, error });

  if (error || !data) {
    return {
      props: {
        nome: 'Usuário',
      },
    };
  }

  return {
    props: {
      nome: data.nome || 'Usuário',
    },
  };
};

export default function Painel({ nome }: { nome: string }) {
  const [leadsCaptados] = useState(3);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const finalProgresso = (leadsCaptados % 10) * 10;
    let atual = 0;
    const intervalo = setInterval(() => {
      if (atual >= finalProgresso) {
        clearInterval(intervalo);
      } else {
        atual += 1;
        setProgresso(atual);
      }
    }, 20);

    return () => clearInterval(intervalo);
  }, [leadsCaptados]);

  const angle = (progresso / 100) * 360 - 90;
  const radius = 68;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  const corProgresso = progresso <= 30
    ? '#f97316'
    : progresso <= 70
    ? '#facc15'
    : '#22c55e';

  function capitalizarPrimeiroNome(nomeCompleto: string) {
    const primeiro = nomeCompleto?.split(' ')[0] || '';
    return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 flex flex-col shadow-lg">
        <div className="flex items-center justify-center h-24 mb-8">
          <div className="text-2xl font-bold text-green-600">LOGO</div>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/painel" className="text-gray-700 hover:text-green-500 font-semibold transition">Painel</Link>
          <Link href="/dados" className="text-gray-700 hover:text-green-500 font-semibold transition">Meus Dados</Link>
          <Link href="/links" className="text-gray-700 hover:text-green-500 font-semibold transition">Links</Link>
          <Link href="/relatorio" className="text-gray-700 hover:text-green-500 font-semibold transition">Relatório</Link>
          <Link href="/saque" className="text-gray-700 hover:text-green-500 font-semibold transition">Saque</Link>
          <Link href="/pagamento" className="text-gray-700 hover:text-green-500 font-semibold transition">Pagamento</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Olá, {capitalizarPrimeiroNome(nome)} 👋
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">Saldo Disponível</h2>
            <p className="text-4xl font-extrabold text-gray-700 mb-4">R$ 0,00</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Indicações</h2>
            <p className="text-4xl font-extrabold text-gray-700 mb-4">{leadsCaptados}</p>
            <Link href="/links" className="text-blue-600 font-semibold hover:underline">Ver minhas indicações</Link>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-purple-600 mb-2">Parceiros</h2>
            <p className="text-4xl font-extrabold text-gray-700 mb-4">0</p>
            <Link href="/parceiros" className="text-purple-600 font-semibold hover:underline">Ver meus parceiros</Link>
          </div>
        </div>

        <div className="bg-white mt-12 p-8 rounded-3xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 text-gray-700">Progresso para Saque</h2>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div
              className="absolute w-full h-full rounded-full shadow-inner"
              style={{
                background: `conic-gradient(${corProgresso} ${progresso * 3.6}deg, #e5e7eb 0deg)`,
                transition: 'background 0.5s ease'
              }}
            ></div>
            <div className="absolute w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: corProgresso }}>{progresso}%</span>
            </div>
            <div
              className="absolute w-6 h-6 bg-orange-500 rounded-full shadow-md"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: corProgresso,
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
