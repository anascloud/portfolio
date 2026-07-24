"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { fetchUsers, ApiUser } from "@/services/user.service";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  mobileNo?: string;
}

const STORAGE_KEY = "anas_dashboard_users";

function loadUsers(): DashboardUser[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: DashboardUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function apiUserToDashboard(u: ApiUser): DashboardUser {
  return {
    id: `api-${u.id}`,
    name: u.fullName,
    email: u.email,
    role: "user",
    mobileNo: u.mobileNo,
  };
}

export default function DashboardUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [apiUsers, setApiUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DashboardUser>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "editor", mobileNo: "" });

  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUsers(session.accessToken as string)
      .then((data) => setApiUsers(data.map(apiUserToDashboard)))
      .catch((err) => console.error("Failed to fetch API users:", err))
      .finally(() => setLoading(false));
  }, [session]);

  const localUsers = users;
  const allUsers = [...apiUsers, ...localUsers];

  const persist = (next: DashboardUser[]) => {
    setUsers(next);
    saveUsers(next);
  };

  const startEdit = (u: DashboardUser) => {
    setEditingId(u.id);
    setEditForm(u);
  };

  const saveEdit = () => {
    if (!editingId) return;
    persist(localUsers.map((u) => (u.id === editingId ? { ...u, ...editForm } : u)));
    setEditingId(null);
  };

  const handleAdd = () => {
    const newUser: DashboardUser = { ...addForm, id: Date.now().toString() };
    persist([...localUsers, newUser]);
    setAddForm({ name: "", email: "", role: "editor", mobileNo: "" });
    setShowAdd(false);
  };

  const remove = (id: string) => {
    persist(localUsers.filter((u) => u.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white font-mono">Users</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-mono hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {loading && (
        <div className="text-center text-slate-400 font-mono py-8">Loading users...</div>
      )}

      {showAdd && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white font-mono mb-4">New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input placeholder="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <input placeholder="Email" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <input placeholder="Mobile No" value={addForm.mobileNo} onChange={(e) => setAddForm({ ...addForm, mobileNo: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-mono hover:bg-indigo-500">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-slate-700 rounded-lg text-sm font-mono hover:bg-slate-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4 hidden md:table-cell">Mobile</th>
              <th className="text-left p-4 hidden md:table-cell">Role</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && allUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">No users found.</td>
              </tr>
            )}
            {allUsers.map((u) => {
              const isApiUser = u.id.startsWith("api-");
              return (
                <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  {editingId === u.id && !isApiUser ? (
                    <>
                      <td className="p-4"><input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                      <td className="p-4"><input value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                      <td className="p-4 hidden md:table-cell"><input value={editForm.mobileNo || ""} onChange={(e) => setEditForm({ ...editForm, mobileNo: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                      <td className="p-4 hidden md:table-cell">
                        <select value={editForm.role || "editor"} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="bg-slate-800 p-2 rounded text-white text-sm">
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={saveEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-700 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-white font-medium">{u.name}</td>
                      <td className="p-4 text-slate-400">{u.email}</td>
                      <td className="p-4 hidden md:table-cell text-slate-400">{u.mobileNo || "—"}</td>
                      <td className="p-4 hidden md:table-cell">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.role === "admin" ? "bg-amber-500/10 text-amber-400" :
                          u.role === "editor" ? "bg-indigo-500/10 text-indigo-400" :
                          u.role === "user" ? "bg-emerald-500/10 text-emerald-400" :
                          "bg-slate-500/10 text-slate-400"
                        }`}>{u.role}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {!isApiUser && (
                            <>
                              <button onClick={() => startEdit(u)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => remove(u.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                          {isApiUser && (
                            <span className="text-xs text-slate-600 font-mono">API</span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}