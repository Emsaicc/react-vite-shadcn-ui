"use client"
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCalendar, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface SidebarItemProps {
  to: string;
  icon: React.ReactElement<IconType>;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive, isExpanded }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center p-2 rounded-lg cursor-pointer ${
        isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {isExpanded && <span className="ml-3">{label}</span>}
    </motion.div>
  </Link>
);

export const SidebarLeft: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const sidebarItems: SidebarItemProps[] = [
    { to: '/', icon: <FiHome size={20} />, label: 'Home', isActive: false, isExpanded: isExpanded },
    { to: '/calendar', icon: <FiCalendar size={20} />, label: 'Calendar', isActive: false, isExpanded: isExpanded },
    { to: '/settings', icon: <FiSettings size={20} />, label: 'Settings', isActive: false, isExpanded: isExpanded },
  ];

  return (
    <motion.aside
      initial={{ width: isExpanded ? 240 : 64 }}
      animate={{ width: isExpanded ? 240 : 64 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 z-10 h-screen bg-white shadow-lg overflow-hidden"
    >
      <div className="flex flex-col border-r border-primary h-full">
        <div className="flex items-center justify-between h-16 bg-primary px-4">
          {isExpanded && <h1 className="text-white text-xl font-bold">My App</h1>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-primary-dark transition-colors duration-200"
          >
            {isExpanded ? <FiChevronLeft size={24} color="white" /> : <FiChevronRight size={24} color="white" />}
          </button>
        </div>

        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.to}>
                <SidebarItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                  isExpanded={isExpanded}
                />
              </li>
            ))}
          </ul>
        </nav>

        {isExpanded && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500">© 2023 My App</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};
