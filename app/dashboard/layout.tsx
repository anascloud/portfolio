"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { LayoutDashboard, FolderKanban, Users, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/users", label: "Users", icon: Users },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn, logout, showLoginDialog } = usePortfolio();

  if (!isLoggedIn && !showLoginDialog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400 font-mono">Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/50 pt-16">
      <div className="max-w-7xl mx-auto flex">
        <aside className="w-64 shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-6 hidden md:block">
          <h2 className="text-lg font-bold text-indigo-400 font-mono mb-6">Dashboard</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono transition-all ${
                    active
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono text-red-400 hover:bg-red-900/20 w-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
