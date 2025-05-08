// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // para evitar múltiplas instâncias em hot-reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
