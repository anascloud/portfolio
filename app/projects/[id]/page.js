"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function ProjectDetails({ params }) {
  const { id } = use(params);
  const { projects } = usePortfolio();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const found = projects.find((p) => p.id === id);
    if (found) setProject(found);
  }, [id, projects]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-mono text-lg">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors font-mono mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="relative h-72 md:h-96">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full"
            />
          </div>
          <div className="p-8">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full">
              {project.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-slate-300 mb-8">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition-all"
            >
              Visit Project <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
