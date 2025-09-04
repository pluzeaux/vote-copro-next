"use client";

import { useEffect, useState } from "react";
import VoteForm from "@/components/VoteForm";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="space-y-6 px-4">
      {/* Header animé */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-18 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-b-3xl shadow-lg"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Le Hameau de Chartrettes
        </h1>
        <p className="mt-2 text-lg font-light">
          Bienvenue sur la plateforme de vote en ligne
        </p>
      </motion.div>

      {/* Carte VoteForm avec animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        id="vote"
        className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md"
      >
        {/* <h2 className="text-3xl font-semibold mb-6 text-center">
          Plateforme de vote
        </h2> */}
        {/* <p className="text-center text-slate-600 mb-6">
          Connectez-vous avec votre token pour participer à l'Assemblée Générale.
        </p> */}
        <VoteForm />
      </motion.div>

      {/* Instructions */}
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
    </div>
  );
}
