import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        setErro(data.erro || 'Erro ao fazer login');
        return;
      }

      router.push('/painel');
    } catch (err) {
      console.error(err);
      setErro('Erro inesperado ao tentar fazer login.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            className="p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="p-3 border rounded-xl"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-xl font-semibold">Entrar</button>
        </form>

        <div className="mt-6 text-center">
          <p>Não tem conta?
            <Link href="/cadastro" className="text-blue-600 font-semibold ml-1">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
