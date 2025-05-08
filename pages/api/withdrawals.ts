import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { usuarioId, valor } = req.body;

    if (!usuarioId || !valor) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }

    try {
      const saque = await prisma.saque.create({
        data: {
          usuarioId,
          valor: parseFloat(valor)
        }
      });

      return res.status(201).json(saque);
    } catch (error) {
      console.error("Erro ao registrar saque:", error);
      return res.status(500).json({ erro: "Erro ao registrar saque." });
    }
  } else {
    return res.status(405).json({ erro: "Método não permitido." });
  }
}
