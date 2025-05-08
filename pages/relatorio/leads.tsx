import { useState } from 'react';
import Link from 'next/link';

export default function RelatorioLeads() {
  const leadsFakes = Array.from({ length: 60 }, (_, i) => ({
    nome: `Lead ${i + 1}`,
    data: new Date(2024, 3, i + 1).toLocaleDateString('pt-BR')
  }));

  const [quantidadeLeads, setQuantidadeLeads] = useState(20);
  const [busca, setBusca] = useState('');

  const leadsFiltrados = leadsFakes
    .filter(lead => lead.nome.toLowerCase().includes(busca.toLowerCase()));

  function exportarExcel() {
    const csvContent = "data:text/csv;charset=utf-8,"
      + leadsFiltrados.map(l => `${l.nome};${l.data}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
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
          <h1 className="text-3xl font-bold text-gray-800">📝 Leads Captados</h1>
          <Link href="/relatorio" className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
            ⬅️ Voltar
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar lead..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2"
          />
          <button
            onClick={exportarExcel}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            📥 Exportar Excel
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Nome</th>
                <th className="py-2">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {leadsFiltrados.slice(0, quantidadeLeads).map((lead, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{lead.nome}</td>
                  <td className="py-2">{lead.data}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {quantidadeLeads < leadsFiltrados.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setQuantidadeLeads(prev => prev + 20)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
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
