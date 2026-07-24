"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import { FolderKanban, Users } from "lucide-react";

export default function DashboardOverview() {
  const { projects, user } = usePortfolio();

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Categories", value: new Set(projects.map((p) => p.category)).size, icon: FolderKanban, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Users", value: 1, icon: Users, color: "text-amber-400 bg-amber-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white font-mono mb-2">Overview</h1>
      <p className="text-slate-400 font-mono text-sm mb-8">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400 font-mono mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white font-mono mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <p className="text-slate-500 font-mono text-sm">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{p.title}</p>
                  <p className="text-slate-500 text-xs font-mono">{p.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
