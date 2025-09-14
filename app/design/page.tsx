import VoteFormAmeliore2 from "@/components/VoteFormAmeliore2";
import { redirect } from "next/navigation";

async function saveVotes(choices: Record<string | number, string | number>) {
  // -> ici tu feras ton appel réel (GraphQL/REST). Exemple fictif:
  await new Promise((r) => setTimeout(r, 600));
  // await fetch("/api/votes", { method: "POST", body: JSON.stringify(choices) })
}

export default function VotePage() {
  const resolutions = [
    {
      id: "res-syndic",
      title: "Choix d'une modalité de syndic",
      hintMd:
        "Toutes les possibilités ont été étudiées. **Seules les options suivantes** sont proposées.\n\n" +
        "_Conseil :_ lisez les infos pour connaître impacts et organisation.",
      choices: [
        {
          id: "coop-cs",
          title: "Syndic coopératif avec intégration de ses membres au conseil syndical",
          infoMd:
            "### Détails\n- Meilleure **maîtrise des coûts**\n- Organisation **bénévole**\n- Engagement **plus fort** des copropriétaires",
        },
        {
          id: "prive-h77",
          title: "Syndic Privé Habitat77",
          infoMd:
            "Tarif annuel indicatif : ~**3 200 €**.\n\n- Contrat 3 ans\n- Réunions trimestrielles\n- Astreinte incluse",
        },
        {
          id: "prive-fay",
          title: "Syndic Privé Cabinet Fay",
          infoMd:
            "- Accompagnement juridique\n- Déplacements facturés en sus\n- Délai de prise en main : **2 mois**",
        },
        { id: "none", title: "Aucune de ces modalités ne me convient" },
      ],
    },
    {
      id: "res-proc",
      title: "Procédures judiciaires (cas Favereaux)",
      hintMd:
        "Ces poursuites concernent des **refus de paiement** de charges.\n" +
        "**Impact budgétaire** possible selon l’option retenue.",
      choices: [
        {
          id: "stop",
          title: "Arrêt des procédures",
          infoMd:
            "Effets probables :\n- **Économies** d’honoraires immédiates\n- Risque d’**impayés** plus durables",
        },
        {
          id: "continue",
          title: "Poursuite des procédures",
          infoMd:
            "- Coût juridique **supplémentaire**\n- Signal clair contre les impayés\n- Délai de jugement **imprévisible**",
        },
        { id: "abs", title: "Abstention" },
      ],
    },
  ];

  const onConfirm = async (c: Record<string | number, string | number>) => {
    "use server"; // permet d'appeler cette action côté serveur (Next.js App Router)
    await saveVotes(c);
    redirect("/vote/success");
  };

  return (
    <div className="py-8">
      <VoteFormAmeliore2 resolutions={resolutions} onConfirm={onConfirm} backHref="/" />
    </div>
  );
}
