
import { useState, useEffect, useRef, RefObject } from 'react';

interface MagneticOptions {
  strength?: number;
  distance?: number;
  scale?: number;
}

export function useMagnetic<T extends HTMLElement>(
  options: MagneticOptions = {}
): [RefObject<T>, { isHovering: boolean }] {
  const elementRef = useRef<T>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    strength = 20,
    distance = 60,
    scale = 1.05
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let bounds: DOMRect;
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      bounds = element.getBoundingClientRect();
      
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance2D = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance2D < distance) {
        setIsHovering(true);
        
        mouseX = distanceX;
        mouseY = distanceY;
        
        const maxMove = strength;
        
        const moveX = (mouseX / distance) * maxMove;
        const moveY = (mouseY / distance) * maxMove;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
      } else {
        if (isHovering) {
          setIsHovering(false);
          element.style.transform = 'translate(0, 0) scale(1)';
        }
      }
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      element.style.transform = 'translate(0, 0) scale(1)';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (element) {
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [distance, strength, scale, isHovering]);
  
  return [elementRef, { isHovering }];
}
