
import React, { useEffect, useRef } from 'react';
import { Zap, Brush } from 'lucide-react';

const ToothAligner = ({ size = 60, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2C6.5 2 4 6 4 10c0 3 1.5 5 4 8 1.5 1.5 2.5 3 4 3s2.5-1.5 4-3c2.5-3 4-5 4-8 0-4-2.5-8-8-8Z" />
      <path d="M9.5 10a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-5Z" />
      <path d="M8.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-7Z" />
      <path d="M9.5 13a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5Z" />
    </svg>
  );
};

const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Mouse follow effect for floating elements
    const handleMouseMove = (e: MouseEvent) => {
      const elements = container.querySelectorAll('.floating-element');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      elements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        const speed = 0.05 - (index * 0.01);
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        const translateX = deltaX * speed;
        const translateY = deltaY * speed;
        
        htmlEl.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${translateX * 0.05}deg)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="floating-element absolute top-1/4 left-1/4 opacity-20">
        <ToothAligner size={60} className="text-peak-black revolve-animation" />
      </div>
      <div className="floating-element absolute top-1/3 right-1/4 opacity-20">
        <Brush size={40} className="text-peak-black pulse-soft" />
      </div>
      <div className="floating-element absolute bottom-1/4 right-1/3 opacity-20">
        <Zap size={50} className="text-peak-black revolve-animation" style={{ animationDuration: '20s' }} />
      </div>
    </div>
  );
};

export default FloatingElements;
