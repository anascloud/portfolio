"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, Mail, Shield, Clock } from "lucide-react";

export default function DashboardUsers() {
  const usersList = useQuery(api.users.list);
  const currentUser = useQuery(api.users.me);

  if (usersList === undefined) {
    return (
      <div className="text-center text-slate-400 font-mono py-8">Loading users...</div>
    );
  }

  if (usersList === null) {
    return (
      <div className="text-center text-slate-400 font-mono py-8">Please log in to view users.</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white font-mono">Users</h1>
        <span className="text-sm text-slate-400 font-mono">{usersList.length} total</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4 hidden sm:table-cell">Email</th>
              <th className="text-left p-4 hidden md:table-cell">Email Verified</th>
              <th className="text-left p-4 hidden lg:table-cell">Created</th>
              <th className="text-right p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">No users found.</td>
              </tr>
            )}
            {usersList.map((u) => (
              <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.name || "Unnamed"}</p>
                      <p className="text-xs text-slate-500 font-mono">{u._id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs">{u.email || "—"}</span>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  {u.emailVerificationTime ? (
                    <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded-full">Verified</span>
                  ) : (
                    <span className="text-slate-500 font-mono text-xs">Unverified</span>
                  )}
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                    <Clock className="w-3 h-3" />
                    {u._creationTime ? new Date(u._creationTime).toLocaleDateString() : "—"}
                  </div>
                </td>
                <td className="p-4 text-right">
                  {currentUser?._id === u._id ? (
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full font-mono">
                      <Shield className="w-3 h-3 inline mr-1" />You
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}