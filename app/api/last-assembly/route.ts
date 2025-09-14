import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapte si ton client Prisma est ailleurs

export async function GET() {
  try {
    const latestAssembly = await prisma.assembly.findFirst({
      orderBy: { date: "desc" },
      include: {
        resolutions: {
          orderBy: { id: "asc" },
          include: { choices: true },
        },
      },
    });

    if (!latestAssembly) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(latestAssembly ?? { resolutions: [] });
  } catch (error) {
    console.error("Erreur API last-assembly-resolutions:", error);
    return NextResponse.json({ error: "Impossible de charger les résolutions" }, { status: 500 });
  }
}
