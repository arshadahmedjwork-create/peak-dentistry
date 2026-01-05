
import React from 'react';
import { Calendar } from 'lucide-react';
import { useMagnetic } from '@/hooks/use-magnetic';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FeatureIconPanel = () => {
  const { toast } = useToast();
  const [centerButtonRef, { isHovering: isCenterHovering }] = useMagnetic<HTMLDivElement>({
    strength: 30,
    scale: 1.08,
  });

  const handleAppointmentClick = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    toast({
      title: "Booking section",
      description: "Scroll to booking section",
      duration: 3000,
    });
  };

  return (
    <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="relative">
        {/* Single Central Icon */}
        <div 
          ref={centerButtonRef}
          onClick={handleAppointmentClick}
          className={`w-20 h-20 bg-black text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ${isCenterHovering ? 'scale-110' : ''}`}
        >
          <div className="relative">
            <Calendar size={32} />
            <span className="absolute inset-0 bg-black rounded-full animate-ping opacity-30"></span>
          </div>
          <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
          <div className="absolute -inset-3 border border-white/10 rounded-full animate-pulse"></div>
          
          {/* Info tooltip on hover */}
          <div className={`absolute -left-48 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isCenterHovering ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-medium tracking-wide">Book Your Appointment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureIconPanel;
