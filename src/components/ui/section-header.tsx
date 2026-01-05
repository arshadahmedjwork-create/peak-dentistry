
import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  center = false,
  className = ''
}) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="font-medium mb-4 animate-slide-in">{title}</h2>
      {subtitle && (
        <p className="text-peak-gray-600 max-w-3xl mx-auto text-lg animate-fade-in">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
