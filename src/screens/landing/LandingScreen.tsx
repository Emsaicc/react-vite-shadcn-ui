import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const companies = [
  { name: 'Onesta', color: '#99001F', subdomain: 'onesta', logo: '/IsotipoLimpieza.png' },
  { name: 'Virtual Group', color: '#00495b', subdomain: 'virtualgroup', logo: '/IsotipoPorteriaVirtual.png' },
  { name: 'Masterson', color: '#00594d', subdomain: 'masterson', logo: '/Isotipo.png' },
];

const LandingScreen: React.FC = () => {
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [animatingCompany, setAnimatingCompany] = useState<string | null>(null);

  const handleCompanySelect = (subdomain: string) => {
    if (!selectedCompany) {
      setAnimatingCompany(subdomain);
      setSelectedCompany(subdomain);
      // Delay setting the selectedCompany until the animation is complete
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden p-4">
      <AnimatePresence>
        {hoveredCompany && !selectedCompany && (
          <motion.div
            key={hoveredCompany}
            className="absolute inset-0 z-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 20, opacity: 0.2 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: companies.find(c => c.name === hoveredCompany)?.color,
              originX: 0.5,
              originY: 0.5,
            }}
          />
        )}
      </AnimatePresence>
      <div className="text-center relative z-10 w-full max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 md:mb-8 tracking-wide ${hoveredCompany ? 'text-white' : ''}`}
        >
          <span className="inline-block">Bienvenido a</span>{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={hoveredCompany || 'default'}
              className="inline-block overflow-hidden align-bottom"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ 
                type: 'spring', 
                stiffness: 500, 
                damping: 25,
                mass: 0.25,
                velocity: 1000
              }}
            >
              <span className="inline-block font-bold ">
                {hoveredCompany || 'Masterson'} Asistencia
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 justify-center items-center">
          <AnimatePresence>
            {companies.map((company) => (
              !selectedCompany || selectedCompany === company.subdomain ? (
                <motion.div
                  key={company.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer w-full sm:w-auto"
                  onHoverStart={() => setHoveredCompany(company.name)}
                  onHoverEnd={() => setHoveredCompany(null)}
                  onClick={() => handleCompanySelect(company.subdomain)}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <motion.div
                    className="flex flex-col items-center"
                  >
                    <motion.img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className={`${animatingCompany && 'hidden'} logo w-24 h-24 mb-4`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`w-full ${animatingCompany && animatingCompany !== company.subdomain && 'hidden'} sm:w-48 md:w-56 lg:w-64 h-48 sm:h-48 md:h-56 lg:h-64 rounded-lg shadow-lg flex items-center justify-center transition-colors`}
                      style={{ backgroundColor: company.color }}
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      animate={animatingCompany === company.subdomain ? 
                        { scale: [1, 1.1, 10], x: 0, y: 0 } : 
                        { scale: 1 }
                      }
                      transition={{ duration: animatingCompany ? 1 : 0.3 }}
                    >
                      <motion.span 
                        className="text-white text-xl font-semibold"
                        animate={animatingCompany === company.subdomain ? 
                          { scale: [1, 1.5, 0], opacity: [1, 1, 0] } : 
                          { scale: 1, opacity: 1 }
                        }
                        transition={{ duration: animatingCompany ? 1 : 0.3 }}
                      >
                        {company.name}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : null
            ))}
          </AnimatePresence>
        </div>
      </div>
      {selectedCompany && (
        <motion.div
          className="absolute inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onAnimationComplete={() => {
            window.location.href = `http://${window.location.hostname}:5173/login`;
            // window.location.href = `https://${selectedCompany}.${window.location.hostname}:5173/login`;
          }}
          style={{
            backgroundColor: companies.find(c => c.subdomain === selectedCompany)?.color,
          }}
        />
      )}
    </div>
  );
};

export default LandingScreen;
