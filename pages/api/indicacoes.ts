import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' })
  }

  const { quemIndicouId } = req.body

  if (!quemIndicouId) {
    return res.status(400).json({ erro: 'ID de quem indicou é obrigatório' })
  }

  try {
    const indicacao = await prisma.indicacao.create({
      data: {
        quemIndicouId,
        // quemFoiIndicadoId será preenchido quando o indicado se cadastrar
        // creditado permanece como false até que o indicado finalize o cadastro
      }
    })

    return res.status(201).json(indicacao)
  } catch (error) {
    console.error('Erro ao criar indicação:', error)
    return res.status(500).json({ erro: 'Erro ao registrar indicação' })
  }
}
