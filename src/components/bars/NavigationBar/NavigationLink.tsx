"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface Props {
    children: React.ReactNode
    name: string
    href: string
   
  }
  
  const NavigationLink = ({ children, name, href }: Props) => {
    return (
      <motion.div
      whileHover={{
        scale: 1.05,
        filter: "none"
      }}
      >
        <Link
          to={href}
        
        className="flex  p-1 rounded cursor-pointer stroke-[0.75]  place-items-center gap-3  transition-colors duration-100"
      >
        {children}
        <p>
          {name}
        </p>

      </Link>

      </motion.div>
      
    )
  }
  
  export default NavigationLink