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
  const [forcaSenha, setForcaSenha] = useState<'fraca' | 'media' | 'forte' | null>(null);
  const [cpfValido, setCpfValido] = useState<boolean | null>(null);
  const [emailValido, setEmailValido] = useState<boolean | null>(null);
  const [senhasIguais, setSenhasIguais] = useState<boolean | null>(null);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);

  const dominiosProibidos = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'getnada.com', 'mintemail.com',
    'dispostable.com', 'fakeinbox.com', 'maildrop.cc', 'sharklasers.com'
  ];

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);

    if (value.length === 14) {
      setCpfValido(validarCPF(value));
    } else {
      setCpfValido(null);
    }
  }

  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    setTelefone(value);
  }

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

  function handleSenhaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSenha(value);
    avaliarForcaSenha(value);
    setSenhasIguais(value === confirmarSenha);
  }

  function handleConfirmarSenhaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmarSenha(value);
    setSenhasIguais(senha === value);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);

    if (value.length > 5) {
      setEmailValido(validarEmail(value));
    } else {
      setEmailValido(null);
    }
  }

  function validarSenha(senha: string) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!cpfValido) return alert('CPF inválido!');
    if (!emailValido) return alert('Email inválido ou domínio bloqueado!');
    if (!validarSenha(senha)) return alert('Senha fraca ou inválida!');
    if (senha !== confirmarSenha) return alert('Senhas não coincidem!');

    try {
      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, dataNascimento, telefone, email, senha })
      });

      const resultado = await resposta.json();
      if (resposta.ok) {
        setCadastroConcluido(true);
      } else {
        alert(resultado.erro || 'Erro ao cadastrar');
      }
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
              <input type="text" placeholder="CPF" className={`p-3 border rounded-xl ${cpfValido === false ? 'border-red-500' : ''}`} value={cpf} onChange={handleCpfChange} required />
              {cpfValido === false && <p className="text-red-500 text-sm">CPF inválido</p>}
              <input type="date" placeholder="Data de nascimento" className="p-3 border rounded-xl" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
              <input type="text" placeholder="Telefone (WhatsApp)" className="p-3 border rounded-xl" value={telefone} onChange={handleTelefoneChange} required />
              <input type="email" placeholder="E-mail" className={`p-3 border rounded-xl ${emailValido === false ? 'border-red-500' : ''}`} value={email} onChange={handleEmailChange} required />
              {emailValido === false && <p className="text-red-500 text-xs">E-mail inválido ou domínio não permitido.</p>}
              <input type="password" placeholder="Senha" className="p-3 border rounded-xl" value={senha} onChange={handleSenhaChange} required />
              {forcaSenha && (
                <div className="w-full h-2 rounded bg-gray-300 overflow-hidden">
                  <div className={`h-full ${forcaSenha === 'fraca' ? 'bg-red-500 w-1/3' : forcaSenha === 'media' ? 'bg-yellow-400 w-2/3' : 'bg-green-500 w-full'}`}></div>
                </div>
              )}
              {forcaSenha && <p className={`text-xs ${forcaSenha === 'fraca' ? 'text-red-500' : forcaSenha === 'media' ? 'text-yellow-600' : 'text-green-500'}`}>{forcaSenha === 'fraca' ? 'Senha Fraca' : forcaSenha === 'media' ? 'Senha Média' : 'Senha Forte'}</p>}
              <input type="password" placeholder="Confirmar senha" className={`p-3 border rounded-xl ${senhasIguais === false ? 'border-red-500' : ''}`} value={confirmarSenha} onChange={handleConfirmarSenhaChange} required />
              {senhasIguais === false && <p className="text-red-500 text-xs">As senhas não coincidem.</p>}
              <button type="submit" className="bg-green-500 text-white p-3 rounded-xl font-semibold">Cadastrar</button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Cadastro realizado com sucesso!</h2>
            <Link href="/login">
              <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold">Entrar</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
