// pages/api/withdrawals.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, amount } = req.body;
    const wd = await prisma.withdrawal.create({
      data: { userId, amount: parseFloat(amount) },
    });
    return res.status(201).json(wd);
  }
  if (req.method === "GET") {
    const wds = await prisma.withdrawal.findMany({ include: { user: true } });
    return res.json(wds);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
