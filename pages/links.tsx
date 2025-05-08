import { useState } from 'react';
import Link from 'next/link';

export default function Links() {
  const [copiedLead, setCopiedLead] = useState(false);
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);

  const idAfiliado = '12345'; // Simulado
  const linkLead = `https://seusite.com/captar/${idAfiliado}`;
  const linkAfiliado = `https://seusite.com/afiliado/${idAfiliado}`;

  function copiarTexto(texto: string, tipo: 'lead' | 'afiliado') {
    navigator.clipboard.writeText(texto);
    if (tipo === 'lead') {
      setCopiedLead(true);
      setTimeout(() => setCopiedLead(false), 2000);
    } else {
      setCopiedAffiliate(true);
      setTimeout(() => setCopiedAffiliate(false), 2000);
    }
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
        <div className="flex flex-col items-center mb-10">
          <span className="text-4xl mb-2">🔗</span>
          <h1 className="text-4xl font-bold text-gray-800">Meus Links</h1>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg space-y-6">
          <div className="text-center text-gray-600 mb-6">
            <p className="text-lg">Seu ID de afiliado:</p>
            <p className="text-2xl font-bold text-green-600">{idAfiliado}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Link para captar leads</label>
              <div className="flex">
                <input
                  type="text"
                  value={linkLead}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => copiarTexto(linkLead, 'lead')}
                  className="bg-green-500 text-white px-5 rounded-r-lg hover:bg-green-600 transition"
                >
                  {copiedLead ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Link para indicar afiliados</label>
              <div className="flex">
                <input
                  type="text"
                  value={linkAfiliado}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => copiarTexto(linkAfiliado, 'afiliado')}
                  className="bg-green-500 text-white px-5 rounded-r-lg hover:bg-green-600 transition"
                >
                  {copiedAffiliate ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
