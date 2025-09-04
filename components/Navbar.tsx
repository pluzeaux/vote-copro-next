"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const handleRefresh = () => {
  window.location.href = "/";
}

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button 
          onClick={handleRefresh} 
          className="text-xl font-bold text-blue-600 hover:text-blue-800 transition"
        >
              Le Hameau de Chartrettes
        </button>
        <div className="space-x-4">
          <Link href="/admin" className="text-slate-700 hover:text-blue-600 transition">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
