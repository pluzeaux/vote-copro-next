// app/api/resolutions/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // Prisma a besoin du runtime Node

// Optionnel (évite les fuites en dev hot-reload)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  const data = await prisma.resolution.findMany({
    orderBy: { id: "asc" },
    include: { choices: { orderBy: { id: "asc" } } },
  });

  const payload = data.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    choices: r.choices.map((c) => ({
      id: c.id,
      label: c.title,
      info: c.infoMarkdown,
    })),
  }));

  return NextResponse.json(payload);
}
