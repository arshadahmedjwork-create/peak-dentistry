
import React from 'react';

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-10 overflow-hidden ${className}`}>
      <div 
        className="absolute -inset-[100px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,rgba(255,255,255,0)_70%)] animate-[spin_30s_linear_infinite]"
        style={{ willChange: 'transform' }}
      ></div>
    </div>
  );
};

export default AnimatedGradient;
