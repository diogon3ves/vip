import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' })
  }

  const { nome, cpf, dataNascimento, telefone, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' })
  }

  const existente = await prisma.usuario.findUnique({ where: { email } })
  if (existente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' })
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10)

  try {
    const novo = await prisma.usuario.create({
      data: {
        nome,
        cpf,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        telefone,
        email,
        senha: senhaCriptografada,
      }
    })

    return res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: { id: novo.id, email: novo.email } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário' })
  }
}
