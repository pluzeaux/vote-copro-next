"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SeparatedRadioGroup } from "@/components/SeparatedRadioGroup"; // adapte le chemin si besoin
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { saveVotesAction } from "@/app/actions/saveVotes";

type Assembly = { id: number; title: string; date: string; resolutions: Resolution[] };
type Resolution = { id: number; title: string; description?: string; choices: Choice[] };
type Choice = { id: number; title: string; infoMarkdown?: string };
type Owner = { id: number; name: string; email: string; tantiemes: number };

export default function VoteForm() {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [step, setStep] = useState<"token" | "vote" | "confirm" | "done">("token");
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Charger la dernière assemblée ---
  useEffect(() => {
    async function loadAssembly() {
      try {
        const res = await fetch("/api/last-assembly");
        const data = await res.json();
        setAssembly(data);
        setResolutions(data?.resolutions ?? []);
      } catch (err) {
        console.error("Erreur chargement assemblée:", err);
        setResolutions([]);
      }
    }
    loadAssembly();
  }, []);

  const allSelected = useMemo(
    () => resolutions.length > 0 && resolutions.every((r) => choices[r.id] !== undefined),
    [resolutions, choices]
  );

  const abandon = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    setMessage(null);
  }, [step]); // ← reset à chaque step

  // --- Validation du token ---
  const validateToken = async () => {
    if (!token) return setMessage("Veuillez entrer votre token");
    setLoading(true);
    try {
      const q = `
      mutation Login($token:String!) {
        login(token:$token) {
          id
          name
          email
          tantiemes
        }
      }`;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, variables: { token } }),
      });
      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        // ici tu récupères ton throw new Error côté resolver
        setMessage(data.errors[0].message);
        setIsValidToken(false);
      } else {
        setOwner(data.data.login);
        // si pas d’erreur => token OK
        setIsValidToken(true);
        setStep("vote");
      }
    } catch (err) {
      setMessage("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (resolutionId: number, choiceId: number) => {
    setChoices((prev) => ({ ...prev, [resolutionId]: choiceId }));
  };

  // --- Confirmation ---
  const goToConfirm = () => {
    if (resolutions.some((r) => !choices[r.id])) {
      setMessage("Veuillez répondre à toutes les résolutions");
      return;
    }
    setStep("confirm");
  };

  // --- Envoi des votes ---
  const submitVote = async () => {
    setLoading(true);
    try {
      const votes = Object.entries(choices).map(([resolutionId, choiceId]) => ({
        resolutionId: Number(resolutionId),
        choiceId: Number(choiceId),
      }));
      const q = `mutation Vote($token:String!,$votes:[VoteInput!]!){ vote(token:$token,votes:$votes) }`;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, variables: { token, votes } }),
      });
      const json = await res.json();
      if (json.errors) setMessage(json.errors[0].message);
      else {
        setMessage("Vote enregistré — merci !");
        setStep("done");
      }
    } catch (e) {
      setMessage("Erreur lors de l'envoi du vote");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (choices: Record<number, number>) => {
    await saveVotesAction(token, owner.id, assembly.id, choices);
    setStep("done");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // --- UI ---
  return (
    <AnimatePresence mode="wait">
      {step === "token" && (
        <>
          <motion.div
            key="token"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="ml-0 mr-0  p-8 py-20 bg-white rounded-xl shadow-md "
          >
            <p className="text-lg text-center text-slate-600 mb-6">
              Connectez-vous pour participer à l'Assemblée Générale.
            </p>
            <div className="grid min-h-30 place-items-center justify-center">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Entrez votre token"
                className="w-lg p-2 border rounded"
              />
              {message && <p className="text-red-600">{message}</p>}
              <motion.button
                onClick={validateToken}
                disabled={loading}
                className="w-lg bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {loading ? "Vérification..." : "Valider le token"}
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="instructions"
            className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-4"
          >
            <h3 className="text-2xl font-semibold">Comment voter :</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Entrez votre token reçu par email.</li>
              <li>Validez vos choix pour chaque résolution.</li>
              <li>Confirmez votre vote avant soumission finale.</li>
              <li>Vous pouvez corriger vos choix avant validation.</li>
            </ul>
          </motion.div>
        </>
      )}

      {step === "vote" && (
        <>
          {resolutions.map((res) => (
            <section key={res.id} className="space-y-6">
              <motion.div
                key="vote"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardVariants}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
              >
                {/* Titre + icône */}
                <div className="mb-3 flex items-start gap-2">
                  <CheckCircleIcon className="h-6 w-6 shrink-0 text-blue-500" />
                  <h2 className="text-lg font-semibold leading-6 text-gray-900">{res.title}</h2>
                </div>
                {res.description && (
                  <div className="mb-5 text-sm text-gray-600">
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.description}</ReactMarkdown>
                    </div>
                  </div>
                )}
                <SeparatedRadioGroup
                  name={`res-${res.id}`}
                  value={choices[res.id] ?? null}
                  onValueChangeAction={(v) =>
                    setChoices((prev) => ({ ...prev, [res.id]: Number(v) }))
                  }
                  title="Options"
                  options={res.choices.map((c) => ({
                    value: c.id,
                    label: c.title,
                    info: c.infoMarkdown,
                  }))}
                />
              </motion.div>
            </section>
          ))}

          {message && <p className="text-red-600">{message}</p>}
          <div className="flex justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mr-6 inline-flex justify-center items-center px-6 py-3   text-white font-medium rounded-lg shadow-md transition bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-700"
              onClick={abandon}
            >
              Abandon
            </motion.button>
            <motion.button
              type="button"
              disabled={!allSelected}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "ml-6 inline-flex justify-center items-center px-6 py-3   text-white font-medium rounded-lg shadow-md transition",
                allSelected
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed",
              ].join(" ")}
              onClick={goToConfirm}
            >
              Confirmer mes choix
            </motion.button>
          </div>
        </>
      )}

      {step === "confirm" && (
        <motion.div
          key="confirm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div className="mb-15 flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold">Confirmation</h2>
          </div>

          {resolutions.map((res) => (
            <div key={res.id} className="p-4 rounded-xl bg-white shadow">
              <strong>{res.title}:</strong>{" "}
              {res.choices.find((c) => c.id === choices[res.id])?.title ?? "Aucun choix"}
            </div>
          ))}
          <div className="mt-15 pt-8 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep("vote")}
              className="mr-6 inline-flex justify-center items-center px-6 py-3   text-white font-medium rounded-lg shadow-md transition bg-gradient-to-r from-gray-500 to-gray-600 hover:bg-gray-700"
            >
              Retour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleConfirm(choices)}
              disabled={loading}
              className="mr-6 inline-flex justify-center items-center px-6 py-3   text-white font-medium rounded-lg shadow-md transition bg-gradient-to-r from-green-500 to-green-600 hover:bg-green-700"
            >
              {loading ? "Envoi..." : "Confirmer mon vote"}
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === "done" && (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4 rounded-xl shadow-md p-6"
        >
          <h1 className="text-xl font-bold">Merci pour votre participation</h1>
          <p>Vos votes ont été enregistrés avec succès.</p>
          <p>Un mail de confirmation de vos votes vous à été envoyé</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
