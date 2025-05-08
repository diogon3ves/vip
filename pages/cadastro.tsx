import { useState } from 'react';
import Link from 'next/link';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cadastroConcluido, setCadastroConcluido] = useState(false);

  const [cpfValido, setCpfValido] = useState<boolean | null>(null);
  const [emailValido, setEmailValido] = useState<boolean | null>(null);
  const [senhasIguais, setSenhasIguais] = useState<boolean | null>(null);
  const [forcaSenha, setForcaSenha] = useState<'fraca' | 'media' | 'forte' | null>(null);

  const dominiosProibidos = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
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
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  function validarEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominio = email.split('@')[1].toLowerCase();
    return regex.test(email) && !dominiosProibidos.includes(dominio);
  }

  function avaliarForcaSenha(valor: string) {
    if (!valor) return setForcaSenha(null);
    const forte = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(valor);
    const media = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(valor);
    setForcaSenha(forte ? 'forte' : media ? 'media' : 'fraca');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validarCPF(cpf)) return alert('CPF inválido');
    if (!validarEmail(email)) return alert('Email inválido ou bloqueado');
    if (senha !== confirmarSenha) return alert('As senhas não coincidem');

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, dataNascimento, telefone, email, senha }),
      });

      const data = await res.json();
      if (res.ok) setCadastroConcluido(true);
      else alert(data.erro || 'Erro ao cadastrar');
    } catch (err) {
      console.error(err);
      alert('Erro inesperado');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {!cadastroConcluido ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="Nome completo" className="p-3 border rounded-xl" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="text" placeholder="CPF" className="p-3 border rounded-xl" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
              <input type="date" placeholder="Data de nascimento" className="p-3 border rounded-xl" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
              <input type="text" placeholder="Telefone (WhatsApp)" className="p-3 border rounded-xl" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              <input type="email" placeholder="E-mail" className="p-3 border rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Senha" className="p-3 border rounded-xl" value={senha} onChange={(e) => { setSenha(e.target.value); avaliarForcaSenha(e.target.value); }} required />
              <input type="password" placeholder="Confirmar senha" className="p-3 border rounded-xl" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
              <button type="submit" className="bg-green-500 text-white p-3 rounded-xl font-semibold">Cadastrar</button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl text-green-600 font-bold mb-4">Cadastro realizado com sucesso!</h2>
            <Link href="/login">
              <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">Entrar</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
