import Link from 'next/link';

export default function RelatorioResumo() {
  const leadsCaptados = 22;
  const parceirosIndicados = 3;

  const getNivelLeads = (leads: number) => {
    if (leads >= 50) return 'Ouro 🥇';
    if (leads >= 30) return 'Prata 🥈';
    return 'Bronze 🏅';
  };

  const getNivelParceiros = (parceiros: number) => {
    if (parceiros >= 6) return 'Ouro 🥇';
    if (parceiros >= 3) return 'Prata 🥈';
    return 'Bronze 🏅';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 flex flex-col shadow-lg">
        <div className="text-2xl font-bold text-green-600 text-center mb-8">LOGO</div>
        <nav className="flex flex-col space-y-4">
          <Link href="/painel" className="text-gray-700 hover:text-green-500 font-semibold transition">Painel</Link>
          <Link href="/dados" className="text-gray-700 hover:text-green-500 font-semibold transition">Meus Dados</Link>
          <Link href="/links" className="text-gray-700 hover:text-green-500 font-semibold transition">Links</Link>
          <Link href="/relatorio" className="text-gray-700 hover:text-green-500 font-semibold transition">Relatório</Link>
          <Link href="/saque" className="text-gray-700 hover:text-green-500 font-semibold transition">Saque</Link>
          <Link href="/pagamento" className="text-gray-700 hover:text-green-500 font-semibold transition">Pagamento</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 space-y-10">
        <div className="text-center mb-10">
          <span className="text-4xl">📈</span>
          <h1 className="text-4xl font-bold text-gray-800">Resumo de Conquistas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Card Leads */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Indicações (Leads)</h2>
            <p className="text-4xl font-bold text-green-500">{leadsCaptados}</p>
            <p className="text-xl font-semibold text-gray-600">Nível: {getNivelLeads(leadsCaptados)}</p>
            <Link href="/relatorio/leads" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              🔍 Ver detalhes
            </Link>
          </div>

          {/* Card Parceiros */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Indicações (Parceiros)</h2>
            <p className="text-4xl font-bold text-purple-500">{parceirosIndicados}</p>
            <p className="text-xl font-semibold text-gray-600">Nível: {getNivelParceiros(parceirosIndicados)}</p>
            <Link href="/relatorio/parceiros" className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition">
              🔍 Ver detalhes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
