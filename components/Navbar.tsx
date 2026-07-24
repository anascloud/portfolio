"use client";
import Image from "next/image";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { Download, Plus, LogIn, LogOut, Mail, Globe } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Navbar() {
  const { setIsAddModalOpen, isLoggedIn, logout, setShowLoginDialog } = usePortfolio();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-400 font-mono">
          <Image src="/logo.png" alt="Logo" width={200} height={50} />
        </Link>
        <div className="flex items-center gap-4 py-3">
          <div className="hidden md:flex items-center gap-3 mr-2">
            <a href="mailto:anasbinsabiet@gmail.com" className="text-slate-400 hover:text-indigo-400 transition-colors" title="Email">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com/anasbinsabiet" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors" title="GitHub">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/anasbinsabiet" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors" title="LinkedIn">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://anascloud.blogspot.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors" title="Blog">
              <Globe className="w-4 h-4" />
            </a>
          </div>

          <a
            href="/#projects"
            className="text-slate-300 hover:text-indigo-400 transition-colors text-sm font-mono"
          >
            Projects
          </a>

          {isLoggedIn && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-mono hover:bg-indigo-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}

          <a
            href="#"
            className="hidden md:flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-mono hover:bg-indigo-500 transition-colors"
          >
            <Download className="w-4 h-4" /> Download My CV
          </a>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-red-400 rounded-lg text-sm font-mono transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginDialog(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-indigo-400 rounded-lg text-sm font-mono transition-colors"
              title="Login"
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
