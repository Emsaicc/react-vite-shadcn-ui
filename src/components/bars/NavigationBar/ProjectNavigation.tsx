"use client"
import { motion } from "framer-motion"
import NavigationLink from "./NavigationLink"
import { projectItems } from "./ProjectItems"
import {  X } from "lucide-react"
import { useUser } from "@/context/UserContext"

interface Props {
  selectedProject: string | null
  setSelectedProject: (project: string | null) => void
  isOpen: boolean
}

const ProjectNavigation = ({
  selectedProject,
  setSelectedProject,
  isOpen,
}: Props) => {
  const selectedProjectItem = projectItems.find((item) => item.name === selectedProject);
  const {theme} = useUser();

  if (!selectedProjectItem) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isOpen ? 150 : 100, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className={`h-full flex bg-white z-50 flex-col gap-8 w-64 absolute ml-0 ${
        isOpen ? "left-60" : ""
      } border-r border-neutral-800 `}
    >
      <div className="flex flex-col gap-1 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{selectedProjectItem.name}</h2>
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-primary font-semibold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4">
        {selectedProjectItem.navigationItems && selectedProjectItem.navigationItems.map((item) => (
          <div className="my-1" key={item.name} onClick={() => setSelectedProject(null)}>
          <NavigationLink href={item.href} name={item.name}>
            <item.icon style={{stroke: theme && theme.primary}} className="min-w-8 w-8" />
          </NavigationLink>
          </div>
        ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectNavigation