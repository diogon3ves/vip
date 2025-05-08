import { useState } from 'react';
import Link from 'next/link';

export default function Cadastro() {
  const [cpf, setCpf] = useState('');
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
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) return false;

    const dominio = email.split('@')[1].toLowerCase();
    if (dominiosProibidos.includes(dominio)) return false;

    return true;
  }

  function avaliarForcaSenha(valor: string) {
    if (!valor) {
      setForcaSenha(null);
      return;
    }
    const fraca = valor.length < 8;
    const media = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(valor);
    const forte = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(valor);

    if (forte) setForcaSenha('forte');
    else if (media) setForcaSenha('media');
    else setForcaSenha('fraca');
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!cpfValido) {
      alert('CPF inválido! Corrija antes de continuar.');
      return;
    }

    if (!emailValido) {
      alert('E-mail inválido ou domínio temporário não permitido.');
      return;
    }

    if (!validarSenha(senha)) {
      alert('Senha inválida! A senha deve ter no mínimo 8 caracteres, incluindo letras, números e símbolos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    setCadastroConcluido(true);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {!cadastroConcluido ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="Nome completo" className="p-3 border rounded-xl" required />

              <input
                type="text"
                placeholder="CPF"
                className={`p-3 border rounded-xl ${cpfValido === false ? 'border-red-500' : ''}`}
                value={cpf}
                onChange={handleCpfChange}
                required
              />
              {cpfValido === false && <p className="text-red-500 text-sm">CPF inválido</p>}

              <input type="date" placeholder="Data de nascimento" className="p-3 border rounded-xl" required />

              <input
                type="text"
                placeholder="Telefone (WhatsApp)"
                className="p-3 border rounded-xl"
                value={telefone}
                onChange={handleTelefoneChange}
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                className={`p-3 border rounded-xl ${emailValido === false ? 'border-red-500' : ''}`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailValido === false && <p className="text-red-500 text-xs mt-1">E-mail inválido ou domínio não permitido.</p>}

              <input
                type="password"
                placeholder="Senha"
                className="p-3 border rounded-xl"
                value={senha}
                onChange={handleSenhaChange}
                required
              />

              {forcaSenha && (
                <div className="w-full h-2 rounded bg-gray-300 overflow-hidden">
                  <div
                    className={`
                      h-full
                      ${forcaSenha === 'fraca' ? 'bg-red-500 w-1/3' :
                        forcaSenha === 'media' ? 'bg-yellow-400 w-2/3' :
                        'bg-green-500 w-full'
                      }
                    `}
                  ></div>
                </div>
              )}

              {forcaSenha && (
                <p className={`text-xs mt-1 ${
                  forcaSenha === 'fraca' ? 'text-red-500' :
                  forcaSenha === 'media' ? 'text-yellow-600' :
                  'text-green-500'
                }`}>
                  {forcaSenha === 'fraca' ? 'Senha Fraca' : forcaSenha === 'media' ? 'Senha Média' : 'Senha Forte'}
                </p>
              )}

              <input
                type="password"
                placeholder="Confirmar senha"
                className={`p-3 border rounded-xl ${senhasIguais === false ? 'border-red-500' : ''}`}
                value={confirmarSenha}
                onChange={handleConfirmarSenhaChange}
                required
              />
              {senhasIguais === false && <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>}

              <button type="submit" className="bg-green-500 text-white p-3 rounded-xl font-semibold">Cadastrar</button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600 text-center">Cadastro realizado com sucesso!</h2>
            <Link href="/login">
              <button className="bg-green-500 text-white p-3 rounded-xl font-semibold">Entrar</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
