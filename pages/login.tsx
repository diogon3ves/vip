import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form className="flex flex-col space-y-4">
          <input type="email" placeholder="E-mail" className="p-3 border rounded-xl" required />
          <input type="password" placeholder="Senha" className="p-3 border rounded-xl" required />
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
