"use client";

import { useEffect, useState } from "react";
import VoteForm from "@/components/VoteForm";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="space-y-16 px-4 w-3xl">
      {/* Header animé */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-18 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-b-3xl shadow-lg"
      >
        <h1 className="text-4xl font-bold tracking-tight">Le Hameau de Chartrettes</h1>
        <p className="mt-2 text-lg font-light">Bienvenue sur la plateforme de vote en ligne</p>
      </motion.div>

      <section className="space-y-20">
        <VoteForm />
      </section>
    </div>
  );
}
