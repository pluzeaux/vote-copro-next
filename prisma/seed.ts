import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  // ⚠️ Clear dev DB
  await prisma.vote.deleteMany();
  await prisma.token.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.resolution.deleteMany();
  await prisma.assembly.deleteMany();
  await prisma.owner.deleteMany();

  const total = 1000;
  const base = Math.floor(total / 35);
  let remainder = total - base * 35;

  // --- Création de l'Assemblée Générale ---
  const assembly = await prisma.assembly.create({
    data: {
      title: "Assemblée Générale Extraordinaire du 30 Septembre 2025",
    },
  });

  // --- Création des copropriétaires + tokens ---
  for (let i = 1; i <= 35; i++) {
    const tantiemes = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const owner = await prisma.owner.create({
      data: {
        name: `Copropriétaire ${i}`,
        email: `copro${i}@example.com`,
        tantiemes,
      },
    });

    await prisma.token.create({
      data: {
        token: uuidv4(),
        ownerId: owner.id,
        assemblyId: assembly.id,
      },
    });
  }

  const r1 = await prisma.resolution.create({
    data: {
      title: "Choix d'une modalité de syndic",
      description: `
Toutes les possibilités ont été étudiées. **Seules les options suivantes** sont proposées.\n\n
Conseil : lisez les infos pour connaître impacts et organisation.
      `,
      assemblyId: assembly.id,
      choices: {
        create: [
          {
            title: "Syndic coopératif avec intégration de ses membres au conseil syndical",
            infoMarkdown: `
**Les membres de ce syndic coopératif sont :**\n\n
    - Mme Bailly
    - Mme Coffinet
    - M. Chanat
    - M. Luzeaux (président syndic)
\n\n
**Ce choix implique leur intégration au sein du conseil syndical.**
**Ce syndic ne persevrait aucune remunération de la part de la copropriété.**
            `,
          },
          {
            title: "Syndic Privé Habitat77",
            infoMarkdown: `
**Coût annuel minimal de 4 200 € TTC**

- payable d'avance par trimestre civil soit 1 050 € TTC par trimestre.
- **Prévoir un budget annuel global de 5000 € env.**
            `,
          },
          {
            title: "Syndic Privé Cabinet Fay",
            infoMarkdown: `
**Coût annuel minimal de 4 442 € TTC**

- payable à terme échu mensuellement (≈ 370 € TTC/mois).
- **Prévoir un budget annuel global de 5000 € env.**
            `,
          },
          {
            title: "Aucune de ces modalités ne me convient",
            infoMarkdown: `
La constitution d'un syndic de copropriété est une obligation légale.
Aucune autre solution n'a été trouvée :
    Pas de volontaire pour un syndic bénévole.
            `,
          },
        ],
      },
    },
  });

  const r2 = await prisma.resolution.create({
    data: {
      title: "Procédures judiciaires (cas Favereaux)",
      description: `
Ces poursuites concernent des refus de paiement de charges.  
**Impact budgétaire** possible selon l’option retenue.
      `,
      assemblyId: assembly.id,
      choices: {
        create: [
          {
            title: "Arrêt des procédures",
            infoMarkdown: `
Met fin aux frais engagés qui restent minime,  
sachant que M. Favereaux ne pourra vendre son bien, le louer ou en bénéficier
au titre de résidence principale, uniquement sous réserve de s’être totalement
acquitté de ses dettes envers la copropriété.
            `,
          },
          {
            title: "Poursuite des procédures",
            infoMarkdown: `
Poursuite du recouvrement
et exécution forcée potentielle ; **frais additionnels**.
            `,
          },
          {
            title: "Abstention",
            infoMarkdown: "",
          },
        ],
      },
    },
  });

  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
