import { useState } from 'react';
import Link from 'next/link';

export default function RelatorioParceiros() {
  const parceirosFakes = Array.from({ length: 20 }, (_, i) => ({
    nome: `Parceiro ${i + 1}`,
    data: new Date(2024, 2, i + 5).toLocaleDateString('pt-BR')
  }));

  const [quantidadeParceiros, setQuantidadeParceiros] = useState(10);
  const [busca, setBusca] = useState('');

  const parceirosFiltrados = parceirosFakes
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  function exportarExcel() {
    const csvContent = "data:text/csv;charset=utf-8,"
      + parceirosFiltrados.map(p => `${p.nome};${p.data}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parceiros.csv");
    document.body.appendChild(link);
    link.click();
  }

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🤝 Parceiros Indicados</h1>
          <Link href="/relatorio" className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
            ⬅️ Voltar
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar parceiro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2"
          />
          <button
            onClick={exportarExcel}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            📥 Exportar Excel
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Nome</th>
                <th className="py-2">Data de Adesão</th>
              </tr>
            </thead>
            <tbody>
              {parceirosFiltrados.slice(0, quantidadeParceiros).map((parceiro, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{parceiro.nome}</td>
                  <td className="py-2">{parceiro.data}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {quantidadeParceiros < parceirosFiltrados.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setQuantidadeParceiros(prev => prev + 10)}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Carregar mais
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
