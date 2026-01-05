
import { useState, useEffect, useRef } from 'react';

type AnimationOptions = {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
};

export function useInView(options: AnimationOptions = {}) {
  const { 
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    once = true,
    delay = 0
  } = options;
  
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          if (delay) {
            setTimeout(() => {
              setIsInView(true);
              if (once) setHasAnimated(true);
            }, delay);
          } else {
            setIsInView(true);
            if (once) setHasAnimated(true);
          }
        } else if (!entry.isIntersecting && !once) {
          setIsInView(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, root, rootMargin, once, delay, hasAnimated]);

  return [ref, isInView, hasAnimated] as const;
}

export function useStaggeredChildren(
  childCount: number,
  baseDelay: number = 0.1,
  unit: string = 's'
) {
  return Array.from({ length: childCount }).map((_, i) => ({
    style: { animationDelay: `${baseDelay * (i + 1)}${unit}` },
  }));
}

export function useParallax(strength: number = 20) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.clientX) / strength;
      const y = (window.innerHeight / 2 - e.clientY) / strength;
      
      setPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);
  
  return position;
}
