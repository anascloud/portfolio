"use client";
import { useState } from "react";
import { usePortfolio, Project } from "@/context/PortfolioContext";
import { Plus, Pencil, Trash2, X, Check, ExternalLink, ImageIcon } from "lucide-react";

export default function DashboardProjects() {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ title: "", category: "", description: "", image: "", link: "" });

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const saveEdit = () => {
    if (editingId) {
      updateProject(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    addProject(addForm);
    setAddForm({ title: "", category: "", description: "", image: "", link: "" });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white font-mono">Projects</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-mono hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white font-mono mb-4">New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <input placeholder="Category" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <textarea placeholder="Description" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none md:col-span-2 focus:ring-1 focus:ring-indigo-500" />
            <input placeholder="Image URL" value={addForm.image} onChange={(e) => setAddForm({ ...addForm, image: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            <input placeholder="Project Link" value={addForm.link} onChange={(e) => setAddForm({ ...addForm, link: e.target.value })} className="bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500" />
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
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4 hidden md:table-cell">Category</th>
              <th className="text-left p-4 hidden lg:table-cell">Description</th>
              <th className="text-left p-4 hidden xl:table-cell">Image</th>
              <th className="text-left p-4 hidden xl:table-cell">Link</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">No projects found.</td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                {editingId === p.id ? (
                  <>
                    <td className="p-4"><input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                    <td className="p-4 hidden md:table-cell"><input value={editForm.category || ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                    <td className="p-4 hidden lg:table-cell"><input value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                    <td className="p-4 hidden xl:table-cell"><input value={editForm.image || ""} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                    <td className="p-4 hidden xl:table-cell"><input value={editForm.link || ""} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} className="bg-slate-800 p-2 rounded text-white w-full text-sm" /></td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={saveEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-700 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 text-white font-medium">{p.title}</td>
                    <td className="p-4 text-slate-400 hidden md:table-cell">
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm hidden lg:table-cell truncate max-w-xs">{p.description}</td>
                    <td className="p-4 hidden xl:table-cell">
                      {p.image ? (
                        <a href={p.image} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400" title="View Image">
                          <ImageIcon className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400" title="Open Link">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeletingId(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white font-mono mb-2">Delete Project</h3>
            <p className="text-slate-400 text-sm font-mono mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 bg-slate-700 rounded-lg text-sm font-mono hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={() => { deleteProject(deletingId); setDeletingId(null); }} className="px-4 py-2 bg-red-600 rounded-lg text-sm font-mono hover:bg-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}