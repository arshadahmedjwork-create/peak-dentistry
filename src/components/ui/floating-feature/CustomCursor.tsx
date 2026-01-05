
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CustomCursorProps {
  coordinates: { x: number; y: number };
  isDarkMode: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ coordinates, isDarkMode }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleHoverChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverableElement = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.hover-glow') ||
        target.closest('.cursor-pointer-glow') ||
        target.closest('.btn-primary') ||
        target.closest('.btn-outline') ||
        target.closest('.animated-button') ||
        target.closest('.magnetic-button') ||
        target.tagName === 'BUTTON' || 
        target.tagName === 'A';
      
      setIsHovering(!!isHoverableElement);
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleHoverChange);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleHoverChange);
    };
  }, []);
  
  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-transform duration-100"
      style={{ 
        left: `${coordinates.x}px`, 
        top: `${coordinates.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div 
        className={cn(
          "mountain-cursor-animation transition-all duration-200",
          isHovering && "scale-125",
          isClicking && "scale-90"
        )}
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            "cursor-peak", 
            isDarkMode ? 'text-white' : 'text-black'
          )}
        >
          <path 
            d="M14 5C10.5 15 10.5 15 7 23H21L14 5Z" 
            stroke="currentColor" 
            strokeWidth={isHovering ? "2.5" : "1.5"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill={isHovering ? (isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)") : "none"} 
          />
          <circle 
            cx="14" 
            cy="14" 
            r="13" 
            stroke="currentColor" 
            strokeWidth={isHovering ? "1.5" : "0.5"} 
            fill="none" 
            className={isHovering ? "animate-pulse-glow" : ""}
          />
          {isHovering && (
            <circle 
              cx="14" 
              cy="14" 
              r="18" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              fill="none" 
              className="animate-pulse opacity-30"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;
