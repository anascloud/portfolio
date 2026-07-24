"use client";
import { createContext, useContext, useEffect, ReactNode, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import projectsData from "@/data/projects.json";
import { useState } from "react";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

interface PortfolioContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  user: { id: string; name: string; email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  showLoginDialog: boolean;
  setShowLoginDialog: (v: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("anas_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(projectsData as Project[]);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      setShowLoginDialog(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const addProject = useCallback((newProject: Omit<Project, "id">) => {
    const updatedProjects = [...projects, { ...newProject, id: Date.now().toString() }];
    setProjects(updatedProjects);
    localStorage.setItem("anas_projects", JSON.stringify(updatedProjects));
  }, [projects]);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    const updatedProjects = projects.map((p) => (p.id === id ? { ...p, ...data } : p));
    setProjects(updatedProjects);
    localStorage.setItem("anas_projects", JSON.stringify(updatedProjects));
  }, [projects]);

  const deleteProject = useCallback((id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("anas_projects", JSON.stringify(updatedProjects));
  }, [projects]);

  const isLoggedIn = status === "authenticated";
  const user = session?.user
    ? { id: (session.user as any).id as string, name: session.user.name || "", email: session.user.email || "" }
    : null;

  return (
    <PortfolioContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      isAddModalOpen, setIsAddModalOpen,
      isLoggedIn, user, login, logout, showLoginDialog, setShowLoginDialog
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};
