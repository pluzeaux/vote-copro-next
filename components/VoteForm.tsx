"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Resolution = { id: number; title: string; description?: string };
type Choice = "pour" | "contre" | "abstention";

export default function VoteForm() {
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [step, setStep] = useState<"token" | "vote" | "confirm" | "done">("token");
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [choices, setChoices] = useState<Record<number, Choice>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Validation du token ---
  const validateToken = async () => {
    if (!token) return setMessage("Veuillez entrer votre token");
    setLoading(true);
    try {
      const q = `mutation Login($token:String!){ login(token:$token){ tokenId weight } }`;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, variables: { token } }),
      });
      const json = await res.json();
      if (json.data?.login) {
        setIsValidToken(true);
        setStep("vote");
        // Charger les résolutions
        const rq = `query { resolutions { id title description } }`;
        const res2 = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: rq }),
        });
        const j2 = await res2.json();
        setResolutions(j2.data?.resolutions || []);
      } else {
        setMessage("Token invalide");
      }
    } catch (e) {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
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
      const votes = Object.entries(choices).map(([k, v]) => ({
        resolutionId: Number(k),
        choice: v,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="space-y-38 w-140">
      <AnimatePresence mode="wait">
        {step === "token" && (
          <>
          <motion.div
            key="token"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md space-y-4"
          >
            <p className="text-xl text-center text-slate-600 mb-6">
              Connectez-vous pour participer à l'Assemblée Générale.
            </p>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Connexion
            </h2>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Entrez votre token"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={validateToken}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Vérification..." : "Valider le token"}
            </button>
            {message && (
              <p className="mt-4 text-red-600 text-center">{message}</p>
            )}
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
          <motion.div
            key="vote"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="space-y-6"
          >
            {resolutions.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-slate-500 mt-1">{r.description}</p>
                <div className="mt-4 space-x-4">
                  {(["pour", "contre", "abstention"] as Choice[]).map((c) => (
                    <label
                      key={c}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`r${r.id}`}
                        checked={choices[r.id] === c}
                        onChange={() =>
                          setChoices((prev) => ({ ...prev, [r.id]: c }))
                        }
                        className="accent-blue-600"
                      />
                      <span className="capitalize">{c}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
            {message && <p className="text-red-600">{message}</p>}
            <div className="flex justify-end">
              <button
                onClick={goToConfirm}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Confirmer mes choix
              </button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-center">
              Confirmation de vos votes
            </h2>
            {resolutions.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-gray-50 rounded-xl shadow-md"
              >
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-slate-500 mt-1">{r.description}</p>
                <p className="mt-2">
                  <strong>Votre choix:</strong> {choices[r.id]}
                </p>
              </motion.div>
            ))}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("vote")}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Corriger mes choix
              </button>
              <button
                onClick={submitVote}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                disabled={loading}
              >
                {loading ? "Envoi..." : "Valider le vote"}
              </button>
            </div>
            {message && <p className="text-green-700 text-center">{message}</p>}
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="text-center p-8 bg-white rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-semibold">Merci !</h2>
            <p className="mt-4 text-green-700">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
