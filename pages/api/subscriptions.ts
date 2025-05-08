import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { usuarioId, plano, valor } = req.body;

    if (!usuarioId || !plano || !valor) {
      return res.status(400).json({ erro: "Dados obrigatórios ausentes." });
    }

    try {
      const sub = await prisma.assinatura.create({
        data: {
          usuarioId,
          plano,
          valor: parseFloat(valor)
        },
      });

      return res.status(201).json(sub);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao registrar assinatura." });
    }
  } else {
    return res.status(405).json({ erro: "Método não permitido." });
  }
}
