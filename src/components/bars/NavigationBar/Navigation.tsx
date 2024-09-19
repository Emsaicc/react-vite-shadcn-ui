"use client";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


import ProjectLink from "./ProjectLink";

import ProjectNavigation from "./ProjectNavigation";

import { useUser } from "@/context/UserContext";

import UserProfileCard from "../UserProfileCard";


import { projectItems } from "./ProjectItems";
import { LogOut } from "lucide-react";

import { removeTokenCookie } from "@/utils/cookies";
import {  useNavigate } from "react-router-dom";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "24rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

const Navigation = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();



  const navigate = useNavigate();
  
  const { user } = useUser();
  
  const { setUser,setTheme } = useUser();
  
 

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    setSelectedProject(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    removeTokenCookie();
    setTheme(null);
    setUser(null);
    navigate("/login");
  };

  

  return (
    <>
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
       
        className="bg-white flex flex-col z-10 gap-5 p-5 fixed top-0 left-0 h-full shadow shadow-neutral-600"
      >
        <div className={`flex flex-row w-full items-center ${isOpen ? "justify-between" : ""}`}>
          {isOpen && (
            <div className="flex flex-col space-y-1">
              <p className="text-2xl font-extrabold text-primary tracking-wide">
                {window.location.hostname.split('.')[0] === 'onesta' ? 'Onesta' :
                 window.location.hostname.split('.')[0] === 'virtualgroup' ? 'Virtual Group' :
                 window.location.hostname.split('.')[0] === 'masterson' ? 'Masterson' :
                 ""}
              </p>
              <p className="text-sm text-neutral-500">BACKOFFICE</p>
            </div>
          )}
          <button className="p-1 rounded-full flex" onClick={handleOpenClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              
             
              className="w-8 h-8 stroke-primary"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={svgVariants}
                animate={svgControls}
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row w-full justify-between items-center">
          <div className="relative inline-flex items-center text-xs font-medium w-full">
            {isOpen ? <UserProfileCard user={user} isOpen={isOpen} /> : <div className="min-h-16 bg-red-600"></div>}
          
          </div>
        </div>

       
        <div className="flex flex-col overflow-y-auto overflow-x-hidden gap-3 flex-grow">
          {projectItems.map((item) => (
            <ProjectLink
              href={item.href}
              key={item.name}
              name={item.name}
              hasChildren={item.navigationItems && item.navigationItems.length > 0 ? true : false}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            >
              <item.icon className={`min-w-6 ${isOpen ? "mx-2" : ""} stroke-primary aspect-square`} />
            </ProjectLink>
          ))}
        </div>

        <div className="mt-auto flex ">
            <button
              className="flex items-center gap-2 p-2 text-red-600 hover:text-red-800"
              onClick={handleLogout}
            >
              <LogOut className="stroke-red-600 min-w-8 w-8" />
              {isOpen && <span>Cerrar sesión</span> }
            </button>
          </div>
      </motion.nav>
      <AnimatePresence>
        {selectedProject && (
          <ProjectNavigation
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
