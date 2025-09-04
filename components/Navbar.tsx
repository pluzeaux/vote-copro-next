"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Le Hameau de Chartrettes
        </Link>
        <div className="space-x-4">
          <Link href="#vote" className="text-slate-700 hover:text-blue-600 transition">
            Vote
          </Link>
          <Link href="#instructions" className="text-slate-700 hover:text-blue-600 transition">
            Instructions
          </Link>
          <Link href="/admin" className="text-slate-700 hover:text-blue-600 transition">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
