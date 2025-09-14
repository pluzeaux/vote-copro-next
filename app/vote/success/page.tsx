import prisma from "@/lib/prisma";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default async function VoteSuccessPage({
  searchParams,
}: {
  searchParams: { assemblyId?: string; token?: string };
}) {
  const assemblyId = Number(searchParams.assemblyId);
  const token = searchParams.token;

  let votes: { resolution: string; choice: string }[] = [];
  let assemblyTitle: string | null = null;

  if (assemblyId && token) {
    const assembly = await prisma.assembly.findUnique({
      where: { id: assemblyId },
    });
    assemblyTitle = assembly?.title ?? null;

    const dbToken = await prisma.token.findUnique({
      where: { token },
      include: {
        owner: {
          include: {
            votes: {
              include: {
                resolution: true,
                choice: true,
              },
            },
          },
        },
        assembly: true, // utile si tu veux vérifier l’AG
      },
    });

    votes =
      dbToken?.owner.votes
        .filter((v) => v.resolution.assemblyId === assemblyId)
        .map((v) => ({
          resolution: v.resolution.title,
          choice: v.choice.title,
        })) ?? [];
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Vos votes ont été enregistrés
      </h1>
      {assemblyTitle && (
        <p className="mt-2 text-lg text-gray-700">
          Assemblée : <b>{assemblyTitle}</b>
        </p>
      )}
      <p className="mt-4 text-lg text-gray-600">
        Merci pour votre participation. Un email de confirmation vous a été envoyé.
      </p>

      {votes.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="text-xl font-semibold">Récapitulatif :</h2>
          <ul className="mt-4 space-y-2">
            {votes.map((v, i) => (
              <li key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="font-medium">{v.resolution}</span> →{" "}
                <span className="text-blue-600">{v.choice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700"
      >
        Retour à l’accueil
      </a>
    </div>
  );
}
