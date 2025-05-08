// pages/saque.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type HistoricoItem = {
  id: string;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  tipo: 'Saque' | 'Comissão';
};

export default function Saque() {
  // estados de saque
  const [valor, setValor] = useState('0,00');
  const [confirmar, setConfirmar] = useState(false);

  // dados fixos
  const nome         = 'João da Silva';
  const chavePix     = 'joao@gmail.com';
  const [saldoDisp]  = useState(30.0);
  const [saldoPen]   = useState(12.0);

  // histórico dinamicamente atualizável
  const [historico, setHistorico] = useState<HistoricoItem[]>([
    { id: '#P8WQ1R78', descricao: 'Saque pendente', categoria: 'Saque', data: '29/04/25 21:36', valor: 13.0, tipo: 'Saque' },
    { id: '#X9PNDPN8', descricao: 'Venda autoral',  categoria: 'Comissão', data: '06/04/25 22:29', valor: 13.43, tipo: 'Comissão' },
    { id: '#58GGQYK34', descricao: 'Saque aprovado', categoria: 'Saque', data: '31/03/25 12:02', valor: 283.30, tipo: 'Saque' },
  ]);

  // formata input como R$ xx,xx
  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    let nums = e.target.value.replace(/\D/g, '');
    const n = parseInt(nums || '0', 10);
    const form = (n / 100).toFixed(2).replace('.', ',');
    setValor(form);
  }

  const numerico = parseFloat(valor.replace(',', '.')) || 0;
  const podeSacar = numerico > 0 && numerico <= saldoDisp;

  // gera ID aleatório de 6 chars
  function gerarId() {
    return '#' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // lida com confirmação de saque
  function handleConfirmSaque() {
    const id      = gerarId();
    const nowStr  = new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' });
    const novo    = {
      id,
      descricao: 'Saque realizado',
      categoria: 'Saque',
      data: nowStr,
      valor: numerico,
      tipo: 'Saque' as const
    };
    setHistorico([novo, ...historico]);
    setConfirmar(false);
  }

  // exporta todo o extrato em PDF
  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Extrato de Transações', 14, 22);
    (doc as any).autoTable({
      startY: 30,
      head: [['Código','Descrição','Categoria','Data','Valor']],
      body: historico.map(i=>[
        i.id, i.descricao, i.categoria, i.data, `R$ ${i.valor.toFixed(2).replace('.',',')}`
      ]),
      headStyles: { fillColor: [30,144,255] },
      styles: { fontSize: 12 },
    });
    doc.save('extrato.pdf');
  }

  // gera PDF apenas do comprovante de um item
  function exportComprovante(item: HistoricoItem) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Comprovante de Saque', 14, 20);
    doc.setFontSize(12);
    doc.text(`Código: ${item.id}`, 14, 40);
    doc.text(`Nome: ${nome}`, 14, 50);
    doc.text(`Chave Pix: ${chavePix}`, 14, 60);
    doc.text(`Valor: R$ ${item.valor.toFixed(2).replace('.',',')}`, 14, 70);
    doc.save(`comprovante-${item.id}.pdf`);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Menu lateral */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-green-600 font-bold text-xl mb-6">LOGO</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/painel"    className="text-gray-800 hover:font-semibold">Painel</Link>
          <Link href="/dados"     className="text-gray-800 hover:font-semibold">Meus Dados</Link>
          <Link href="/links"     className="text-gray-800 hover:font-semibold">Links</Link>
          <Link href="/relatorio" className="text-gray-800 hover:font-semibold">Relatório</Link>
          <Link href="/saque"     className="text-gray-800 font-bold">Saque</Link>
          <Link href="/pagamento" className="text-gray-800 hover:font-semibold">Pagamento</Link>
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Finanças</h1>

        {/* Resumo + Solicitar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-semibold text-gray-800">Total</p>
              <p className="text-4xl font-bold text-blue-600">
                R${' '}
                {(saldoDisp + saldoPen).toFixed(2).replace('.',',')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-semibold text-gray-800">Saldo disponível</p>
                <p className="text-2xl font-bold text-green-600">
                  R${saldoDisp.toFixed(2).replace('.',',')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-semibold text-gray-800">Pendente</p>
                <p className="text-2xl font-bold text-orange-500">
                  R${saldoPen.toFixed(2).replace('.',',')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Insira o valor para receber via PIX
            </p>
            <input
              type="text"
              value={`R$ ${valor}`}
              onChange={handleValorChange}
              className="border border-gray-300 rounded px-4 py-2 mb-4 text-lg font-bold"
            />
            <button
              onClick={() => setConfirmar(true)}
              disabled={!podeSacar}
              className={`w-full py-3 rounded text-white font-semibold text-lg ${
                podeSacar ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              $ Solicitar saque
            </button>
          </div>
        </div>

        {/* Slide-over */}
        {confirmar && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black bg-opacity-30"
              onClick={() => setConfirmar(false)}
            />
            <div className="relative ml-auto w-full max-w-lg h-full bg-white shadow-lg p-8 overflow-auto">
              <button
                onClick={() => setConfirmar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">SOLICITAR SAQUE</h2>
              <div className="bg-gray-100 rounded-lg p-6 mb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Nome:</span>
                  <span className="text-lg">{nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Chave Pix:</span>
                  <span className="text-lg">{chavePix}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Valor:</span>
                  <span className="text-lg">R${valor}</span>
                </div>
              </div>
              <p className="text-sm text-red-600 mb-6">
                Seu saque passará pelo processo de validação
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmar(false)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded text-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSaque}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-lg font-semibold"
                >
                  Confirmar saque
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extrato */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Extrato</h2>
            <button
              onClick={exportPDF}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Código</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Categoria</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody>
                {historico.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => exportComprovante(item)}
                        className="text-blue-600 hover:underline"
                      >
                        {item.id}
                      </button>
                    </td>
                    <td className="px-4 py-3">{item.descricao}</td>
                    <td className="px-4 py-3">{item.categoria}</td>
                    <td className="px-4 py-3">{item.data}</td>
                    <td className="px-4 py-3 text-right">
                      {item.tipo === 'Comissão' ? '↑' : '↓'}{' '}
                      R${item.valor.toFixed(2).replace('.',',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
