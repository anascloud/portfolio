"use client";
import { createContext, useState, useContext, useEffect } from "react";
import projectsData from "@/data/projects.json";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("anas_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(projectsData);
    }
    const loggedIn = localStorage.getItem("anas_logged_in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email, password) => {
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

  const addProject = (newProject) => {
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

export const usePortfolio = () => useContext(PortfolioContext);
