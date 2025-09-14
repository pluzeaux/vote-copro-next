"use server";

import { print } from "graphql";
import { VoteDocument, VoteMutation, VoteMutationVariables } from "@/graphql/generated"; // à adapter selon où tu as défini ta mutation GraphQL
import { sendMail } from "@/lib/mailer"; // fonction d’envoi de mail à créer ou adapter

export async function saveVotesAction(
  token: string,
  ownerId: number,
  assemblyId: number,
  choices: Record<number, number> // { resolutionId: choiceId }
) {
  // 1. Préparer la mutation
  const votes = Object.entries(choices).map(([resolutionId, choiceId]) => ({
    resolutionId: Number(resolutionId),
    choiceId: Number(choiceId),
  }));

  const mutation = print(VoteDocument); // ou écrire la mutation inline si tu n’as pas de gql codegen

  // 2. Appeler l’API GraphQL
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: { token, votes },
    }),
  });

  if (!res.ok) {
    throw new Error(`Erreur API GraphQL: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  const createdVotes = json.data.vote;

  // 3. Essayer l’envoi de mail (non bloquant)
  try {
    //  await sendMail(token, assemblyId, createdVotes);
  } catch (err) {
    console.error("Erreur lors de l’envoi du mail :", err);
    // mais on n’interrompt pas le retour
  }

  // 4. Retourner les votes créés
  return createdVotes;
}
