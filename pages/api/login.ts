import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chave_padrao'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' })

  const { email, senha } = req.body

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' })

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) return res.status(401).json({ erro: 'Credenciais inválidas' })

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`)
    
    return res.status(200).json({ mensagem: 'Login efetuado com sucesso' })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ erro: 'Erro interno no servidor' })
  }
}
