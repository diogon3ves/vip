import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_segura'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' })

  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'E-mail e senha obrigatórios' })

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha inválidos' })

  const senhaOk = await bcrypt.compare(senha, usuario.senha)
  if (!senhaOk) return res.status(401).json({ erro: 'E-mail ou senha inválidos' })

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '7d' })

  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })

  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ mensagem: 'Login realizado com sucesso' })
}
