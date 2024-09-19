"use client"

import { motion } from "framer-motion"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"


interface Props {
  children: React.ReactNode
  name: string
  setSelectedProject: (val: string | null) => void
  selectedProject: string | null
  hasChildren : boolean
  href?:string
}

const ProjectLink = ({ children, name, setSelectedProject, selectedProject, hasChildren,href }: Props) => {
  const handleClick = () => {
   if(selectedProject != name){
    setSelectedProject(null)
    setTimeout(() => {
      setSelectedProject(name)
    }, 200)
   }
  }
  return (
    <motion.div
    whileHover={{
      scale: 1.05,
      filter: "none"
    }}
    >
      
    <Link
      
      to={hasChildren ? '#' : href ?? "/"}
      onClick={hasChildren ? handleClick : undefined}
      className="flex p-1 rounded cursor-pointer stroke-[0.75] place-items-center gap-3"
    >
      {children}
      <div className="flex overflow-clip place-items-center justify-between w-full">
        <p className="text-inherit truncate whitespace-nowrap tracking-wide">
          {name}
        </p>
        <ChevronRightIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
      </div>
    </Link>
    </motion.div>
  )
}

export default ProjectLink