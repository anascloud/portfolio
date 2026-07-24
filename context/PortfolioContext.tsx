"use client";
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { Id } from "@/convex/_generated/dataModel";

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
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  showLoginDialog: boolean;
  setShowLoginDialog: (v: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  const userData = useQuery(api.users.me);
  const convexProjects = useQuery(api.projects.list);

  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (convexProjects !== undefined) return;
    const saved = localStorage.getItem("anas_projects");
    if (saved) {
      setLocalProjects(JSON.parse(saved));
    }
  }, [convexProjects]);

  const createProject = useMutation(api.projects.create);
  const updateProjectMutation = useMutation(api.projects.update);
  const deleteProjectMutation = useMutation(api.projects.remove);

  const projects: Project[] = convexProjects !== undefined
    ? convexProjects.map((p) => ({
        id: p._id,
        title: p.title,
        category: p.category,
        description: p.description,
        image: p.image,
        link: p.link,
      }))
    : localProjects;

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signIn("password", { email, password, flow: "signIn" });
      setShowLoginDialog(false);
      return true;
    } catch {
      return false;
    }
  }, [signIn]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      await signIn("password", { email, password, flow: "signUp" });
      setShowLoginDialog(false);
      return true;
    } catch {
      return false;
    }
  }, [signIn]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const addProject = useCallback(async (newProject: Omit<Project, "id">) => {
    if (isAuthenticated) {
      await createProject(newProject);
    } else {
      const updated = [...localProjects, { ...newProject, id: Date.now().toString() }];
      setLocalProjects(updated);
      localStorage.setItem("anas_projects", JSON.stringify(updated));
    }
  }, [createProject, isAuthenticated, localProjects]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    if (isAuthenticated) {
      const { title, category, description, image, link } = data;
      await updateProjectMutation({ id: id as unknown as Id<"projects">, title, category, description, image, link });
    } else {
      const updated = localProjects.map((p) => (p.id === id ? { ...p, ...data } : p));
      setLocalProjects(updated);
      localStorage.setItem("anas_projects", JSON.stringify(updated));
    }
  }, [updateProjectMutation, isAuthenticated, localProjects]);

  const deleteProject = useCallback(async (id: string) => {
    if (isAuthenticated) {
      await deleteProjectMutation({ id: id as unknown as Id<"projects"> });
    } else {
      const updated = localProjects.filter((p) => p.id !== id);
      setLocalProjects(updated);
      localStorage.setItem("anas_projects", JSON.stringify(updated));
    }
  }, [deleteProjectMutation, isAuthenticated, localProjects]);

  const isLoggedIn = isAuthenticated;
  const user = userData
    ? { id: userData._id, name: userData.name || "", email: userData.email || "" }
    : null;

  return (
    <PortfolioContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      isAddModalOpen, setIsAddModalOpen,
      isLoggedIn, user, login, register, logout, showLoginDialog, setShowLoginDialog
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
