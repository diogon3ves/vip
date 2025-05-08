// pages/api/indicacoes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { referrerId, refereeEmail } = req.body;
    // cria a indicação; creditação só vira true quando o indicado se cadastrar
    const indication = await prisma.indication.create({
      data: { referrerId },
    });
    return res.status(201).json(indication);
  }
  if (req.method === "GET") {
    const all = await prisma.indication.findMany({
      include: { referrer: true, referee: true },
    });
    return res.json(all);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
