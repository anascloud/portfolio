"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import projectsData from "@/data/projects.json";

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
  isAddModalOpen: boolean;
  setIsAddModalOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (v: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("anas_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(projectsData as Project[]);
    }
    const loggedIn = localStorage.getItem("anas_logged_in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    if (email === "anasbinsabiet@gmail.com" && password === "anasbinsabiet@gmail.com") {
      setIsLoggedIn(true);
      localStorage.setItem("anas_logged_in", "true");
      setShowLoginDialog(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("anas_logged_in");
  };

  const addProject = (newProject: Omit<Project, "id">) => {
    const updatedProjects = [...projects, { ...newProject, id: Date.now().toString() }];
    setProjects(updatedProjects);
    localStorage.setItem("anas_projects", JSON.stringify(updatedProjects));
  };

  return (
    <PortfolioContext.Provider value={{
      projects, addProject, isAddModalOpen, setIsAddModalOpen,
      isLoggedIn, login, logout, showLoginDialog, setShowLoginDialog
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
