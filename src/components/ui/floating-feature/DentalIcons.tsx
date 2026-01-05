
import React from 'react';

export interface IconProps {
  className?: string;
}

export const ToothIcon = ({ className }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2C6.5 2 4 6 4 10c0 3 1.5 5 4 8 1.5 1.5 2.5 3 4 3s2.5-1.5 4-3c2.5-3 4-5 4-8 0-4-2.5-8-8-8Z" />
  </svg>
);

export const ToothbrushIcon = ({ className }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10 12L14 6"/>
    <path d="M10 6H14"/>
    <path d="M10 12V21"/>
    <path d="M8 16H12"/>
    <path d="M14 6C14 3.8 12.2 2 10 2S6 3.8 6 6"/>
  </svg>
);

export const DentalAlignerIcon = ({ className }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 12C7 14 9 16 12 16C15 16 17 14 17 12V9C17 7 15 5 12 5C9 5 7 7 7 9V12Z"/>
    <path d="M12 5V16"/>
    <path d="M7 9H17"/>
    <path d="M7 12H17"/>
  </svg>
);

export const DentalMirrorIcon = ({ className }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="8" r="6"/>
    <line x1="12" y1="14" x2="12" y2="20"/>
    <line x1="12" y1="20" x2="10" y2="22"/>
  </svg>
);
