
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { ToothIcon } from './DentalIcons';
import FeaturePanel from './FeaturePanel';
import { useToast } from '@/hooks/use-toast';

const FloatingFeaturePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isDarkMode = theme === 'dark';
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  // Track mouse movement for cursor animation with improved performance and throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; // Throttle to ~60fps
      lastUpdate = now;
      
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setCoordinates({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Show a welcome tooltip on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenFeatureTooltip');
    
    if (!hasSeenTooltip && !hasInteracted) {
      const timeout = setTimeout(() => {
        toast({
          title: "Interactive Features",
          description: "Click the floating tooth icon to explore our features!",
          duration: 5000,
        });
        localStorage.setItem('hasSeenFeatureTooltip', 'true');
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [toast, hasInteracted]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    setHasInteracted(true);
  };

  // Pulse animation variants - Fixed the repeatType to use a valid literal value
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0px 0px 0px rgba(0,0,0,0.2)',
        '0px 0px 15px rgba(0,0,0,0.4)',
        '0px 0px 0px rgba(0,0,0,0.2)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror" as const // Using a const assertion to ensure it's a literal type
      }
    }
  };

  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        {/* Enhanced floating tooth icon with better animations */}
        <motion.div
          className={cn(
            "w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer",
            isDarkMode ? "bg-peak-gray-800 text-white" : "bg-white text-peak-black",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          onClick={togglePanel}
          variants={pulseVariants}
          animate="pulse"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ToothIcon className="w-10 h-10" />
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/20 dark:border-white/10"
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "mirror" as const // Using a const assertion here as well
            }}
          />
        </motion.div>

        {/* Enhanced Feature Panel */}
        <AnimatePresence>
          {isOpen && (
            <FeaturePanel 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setTheme(isDarkMode ? 'light' : 'dark')} 
              togglePanel={togglePanel} 
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FloatingFeaturePanel;
