
import React from 'react';
import { Clock, ThermometerSnowflake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration?: string;
  painLevel?: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  duration,
  painLevel,
  link
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="glass h-full p-8 rounded-xl transition-all duration-500 group hover-glow premium-card interactive-card flex flex-col">
      <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-100'}`}>
        {icon}
      </div>

      <h3 className={`text-xl font-medium mb-3 futuristic-border ${isDark ? 'text-white' : ''}`}>{title}</h3>
      <p className={`mb-6 flex-grow ${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>{description}</p>

      <div className="mt-auto">
        {(duration || painLevel) && (
          <div className={`flex items-center gap-4 mb-4 text-sm card-content ${isDark ? 'text-gray-400' : 'text-peak-gray-500'}`}>
            {duration && (
              <div className="flex items-center">
                <Clock size={16} className="mr-1.5 icon-pulse" />
                <span>{duration}</span>
              </div>
            )}

            {painLevel && (
              <div className="flex items-center">
                <ThermometerSnowflake size={16} className="mr-1.5 icon-pulse" />
                <span>{painLevel}</span>
              </div>
            )}
          </div>
        )}

        <Link to={link} className={`inline-flex items-center font-medium transition-all duration-300 link-underline ${isDark ? 'text-white' : 'text-peak-black'}`}>
          Learn More <ArrowRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
