
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ToothbrushIcon, DentalAlignerIcon, DentalMirrorIcon } from './DentalIcons';

interface SecondaryIconsProps {
  isOpen: boolean;
  isDarkMode: boolean;
  togglePanel: () => void;
}

const SecondaryIcons: React.FC<SecondaryIconsProps> = ({ isOpen, isDarkMode, togglePanel }) => {
  if (isOpen) return null;
  
  return (
    <>
      <motion.div
        className={cn(
          "absolute -top-16 right-0 w-10 h-10 rounded-full shadow-md flex items-center justify-center cursor-pointer hover-lift",
          isDarkMode ? "bg-peak-gray-800 text-peak-gray-300" : "bg-white text-peak-gray-600"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1 }}
        onClick={togglePanel}
        whileHover={{ scale: 1.1 }}
      >
        <ToothbrushIcon className="w-6 h-6" />
      </motion.div>
      
      <motion.div
        className={cn(
          "absolute -bottom-16 right-0 w-10 h-10 rounded-full shadow-md flex items-center justify-center cursor-pointer hover-lift",
          isDarkMode ? "bg-peak-gray-800 text-peak-gray-300" : "bg-white text-peak-gray-600"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        onClick={togglePanel}
        whileHover={{ scale: 1.1 }}
      >
        <DentalAlignerIcon className="w-6 h-6" />
      </motion.div>
      
      <motion.div
        className={cn(
          "absolute right-16 top-0 w-10 h-10 rounded-full shadow-md flex items-center justify-center cursor-pointer hover-lift",
          isDarkMode ? "bg-peak-gray-800 text-peak-gray-300" : "bg-white text-peak-gray-600"
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: 0.3 }}
        onClick={togglePanel}
        whileHover={{ scale: 1.1 }}
      >
        <DentalMirrorIcon className="w-6 h-6" />
      </motion.div>
    </>
  );
};

export default SecondaryIcons;
