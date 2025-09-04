"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex justify-center min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="text-slate-700 hover:text-blue-600 transition">
            Résultats
          </Link>
          <Link href="/admin/settings" className="text-slate-700 hover:text-blue-600 transition">
            Paramètres
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
