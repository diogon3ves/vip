// pages/api/subscriptions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, plan, price } = req.body;
    const sub = await prisma.subscription.create({
      data: { userId, plan, price: parseFloat(price) },
    });
    return res.status(201).json(sub);
  }
  if (req.method === "GET") {
    const subs = await prisma.subscription.findMany({ include: { user: true } });
    return res.json(subs);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
