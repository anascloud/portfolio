"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/context/PortfolioContext";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">
            {project.category}
          </span>
          <h3 className="text-lg font-bold text-white mt-3 mb-2">{project.title}</h3>
          <p className="text-sm text-slate-400 mb-4">{project.description}</p>
          {/* <span className="inline-flex items-center gap-1 text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors font-mono">
            View Details <ExternalLink className="w-3 h-3" />
          </span> */}
        </div>
      </Link>
    </motion.div>
  );
}
