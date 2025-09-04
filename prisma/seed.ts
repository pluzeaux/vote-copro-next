import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  // Clear dev (careful : destructive)
  await prisma.vote.deleteMany();
  await prisma.token.deleteMany();
  await prisma.resolution.deleteMany();
  await prisma.owner.deleteMany();

  const total = 1000;
  const base = Math.floor(total / 35);
  let remainder = total - base * 35;

  for (let i = 1; i <= 35; i++) {
    const tantiemes = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const owner = await prisma.owner.create({
      data: {
        name: `Copropriétaire ${i}`,
        email: `copro${i}@example.com`,
        tantiemes
      }
    });

    await prisma.token.create({
      data: {
        token: uuidv4(),
        ownerId: owner.id
      }
    });
  }

  await prisma.resolution.createMany({
    data: [
      { title: "Approbation des comptes", description: "Approbation des comptes de l'exercice N-1" },
      { title: "Budget prévisionnel", description: "Adoption du budget prévisionnel" },
      { title: "Travaux toiture", description: "Travaux de réfection de la toiture" },
      { title: "Contrat d'entretien", description: "Renouvellement du contrat d'entretien" },
      { title: "Questions diverses", description: "Questions diverses" }
    ]
  });

  console.log("Seed terminé !");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
