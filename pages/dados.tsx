import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dados() {
  const [nome] = useState('João da Silva');
  const [cpf] = useState('12345678900');
  const [nascimento] = useState('01/01/1990');

  const [email, setEmail] = useState('joao@gmail.com');
  const [telefone, setTelefone] = useState('11987654321');
  const [banco, setBanco] = useState('Nubank');
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState('cpf');

  const [editando, setEditando] = useState(false);
  const [alterado, setAlterado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [cpfValido, setCpfValido] = useState(true);

  useEffect(() => {
    setAlterado(editando);
  }, [editando]);

  useEffect(() => {
    setChavePix('');
  }, [tipoChavePix]);

  function formatarCPF(cpf: string) {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  }

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  function formatarTelefone(telefone: string) {
    return telefone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }

  function formatarChavePix(chave: string) {
    if (tipoChavePix === 'telefone') {
      return chave
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
    if (tipoChavePix === 'cpf') {
      return chave
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
    }
    return chave;
  }

  function salvarAlteracoes(e: React.FormEvent) {
    e.preventDefault();
    setEditando(false);
    setMensagemSucesso('Dados atualizados com sucesso!');
    setTimeout(() => setMensagemSucesso(''), 4000);
  }

  function handleCpfChange(value: string) {
    setChavePix(value);
    if (tipoChavePix === 'cpf') {
      setCpfValido(validarCPF(value));
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
        <div className="flex items-center justify-center mb-10 gap-2">
          <span className="text-3xl">👤</span>
          <h1 className="text-4xl font-bold text-gray-800">Meus Dados</h1>
        </div>

        {mensagemSucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 animate-pulse">
            {mensagemSucesso}
          </div>
        )}

        <form onSubmit={salvarAlteracoes} className="bg-white p-8 rounded-3xl shadow-lg max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nome completo</label>
            <input type="text" value={nome} disabled className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">CPF</label>
            <input type="text" value={formatarCPF(cpf)} disabled className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Data de nascimento</label>
            <input type="text" value={nascimento} disabled className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editando} className={`w-full border ${editando ? 'border-gray-300' : 'border-gray-200'} rounded-lg p-3`} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Telefone (WhatsApp)</label>
            <input type="text" value={formatarTelefone(telefone)} onChange={(e) => setTelefone(e.target.value)} disabled={!editando} className={`w-full border ${editando ? 'border-gray-300' : 'border-gray-200'} rounded-lg p-3`} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Banco</label>
            <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} disabled={!editando} className={`w-full border ${editando ? 'border-gray-300' : 'border-gray-200'} rounded-lg p-3`} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Chave Pix</label>
            <select value={tipoChavePix} onChange={(e) => setTipoChavePix(e.target.value)} disabled={!editando} className={`w-full border ${editando ? 'border-gray-300' : 'border-gray-200'} rounded-lg p-3 mb-3`}>
              <option value="cpf">CPF</option>
              <option value="telefone">Telefone</option>
              <option value="email">E-mail</option>
            </select>
            <input
              type="text"
              value={formatarChavePix(chavePix)}
              onChange={(e) => handleCpfChange(e.target.value)}
              disabled={!editando}
              className={`w-full border ${editando ? 'border-gray-300' : 'border-gray-200'} rounded-lg p-3`}
              placeholder="Digite a chave Pix"
            />
            {tipoChavePix === 'cpf' && !cpfValido && (
              <p className="text-red-500 text-sm mt-2">CPF inválido</p>
            )}
          </div>

          {alterado && (
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
              Salvar Alterações
            </button>
          )}

          {!editando && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setEditando(true)} type="button" className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>✏️</span> Editar Dados
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
