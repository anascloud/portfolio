"use client";
import { useState, FormEvent } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { X } from "lucide-react";

interface ProjectForm {
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

export default function AddProjectModal() {
  const { addProject, setIsAddModalOpen } = usePortfolio();
  const [form, setForm] = useState<ProjectForm>({ title: "", category: "", description: "", image: "", link: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addProject(form);
    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-8 w-full max-w-lg relative">
        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" required onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-slate-800 p-3 rounded text-white outline-none" />
          <input type="text" placeholder="Category (e.g., AI, Web)" required onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-slate-800 p-3 rounded text-white outline-none" />
          <textarea placeholder="Description" required onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-slate-800 p-3 rounded text-white outline-none"></textarea>
          <input type="url" placeholder="Image URL" required onChange={(e) => setForm({...form, image: e.target.value})} className="w-full bg-slate-800 p-3 rounded text-white outline-none" />
          <input type="url" placeholder="Project Link" required onChange={(e) => setForm({...form, link: e.target.value})} className="w-full bg-slate-800 p-3 rounded text-white outline-none" />
          <button type="submit" className="w-full bg-indigo-600 py-3 rounded font-bold hover:bg-indigo-500 transition">Save Project</button>
        </form>
      </div>
    </div>
  );
}
