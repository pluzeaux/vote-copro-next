"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Result {
  resolutionId: number;
  choice: string;
  totalWeight: number;
  votesCount: number;
}

export default function AdminPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterResolution, setFilterResolution] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadResults = async () => {
    if (!adminPassword) return setErr("Veuillez entrer le mot de passe admin");
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword
        },
        body: JSON.stringify({
          query: `query { adminResults { resolutionId choice totalWeight votesCount } }`
        })
      });
      const j = await res.json();
      if (j.errors) setErr(j.errors[0].message);
      else {
        setResults(j.data.adminResults || []);
        setIsLoggedIn(true); // ✅ Login réussi
      }
    } catch (e) {
      setErr("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(r =>
    filterResolution === "" || r.resolutionId.toString() === filterResolution
  );

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const paginatedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[var(--primary)]"
      >
        Résultats Votes
      </motion.h1>

      {/* Formulaire admin — affiché seulement si pas encore connecté */}
      {!isLoggedIn && (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Mot de passe admin"
            type="password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button
            onClick={loadResults}
            disabled={loading}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            {loading ? "Chargement..." : "Charger"}
          </button>
        </div>
      )}

      {err && <p className="text-red-600">{err}</p>}

      {/* Filtre par résolution */}
      {isLoggedIn && results.length > 0 && (
        <div className="flex gap-2 items-center">
          <label className="font-medium">Filtrer par résolution :</label>
          <input
            type="text"
            placeholder="ID Résolution"
            value={filterResolution}
            onChange={e => setFilterResolution(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      )}

      {/* Liste paginée */}
      {isLoggedIn && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginatedResults.map(r => (
            <motion.div
              key={`${r.resolutionId}-${r.choice}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl shadow transition hover:shadow-lg bg-[var(--card-bg)] hover:bg-[var(--card-hover)]"
            >
              <h3 className="font-semibold text-lg">Résolution {r.resolutionId}</h3>
              <p>
                <strong>{r.choice}</strong> — Poids total : {r.totalWeight} — Bulletins : {r.votesCount}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {isLoggedIn && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Précédent
          </button>
          <span className="px-3 py-1 font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
