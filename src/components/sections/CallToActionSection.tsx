
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { useTheme } from '@/hooks/use-theme';
import { useMagnetic } from '@/hooks/use-magnetic';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const CallToActionSection = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isDarkMode = theme === 'dark';
  
  // Enhanced magnetic effects for buttons
  const [callButtonRef, { isHovering: isCallHovering }] = useMagnetic<HTMLButtonElement>({ 
    strength: 30, 
    scale: 1.05 
  });
  
  const [whatsappButtonRef, { isHovering: isWhatsappHovering }] = useMagnetic<HTMLButtonElement>({ 
    strength: 30, 
    scale: 1.05 
  });
  
  const [calendarButtonRef, { isHovering: isCalendarHovering }] = useMagnetic<HTMLButtonElement>({ 
    strength: 30, 
    scale: 1.05 
  });
  
  const handleCallNow = () => {
    toast({
      title: "Calling...",
      description: "Connecting you to our dental specialists.",
      duration: 3000,
    });
  };
  
  const handleWhatsApp = () => {
    toast({
      title: "WhatsApp Consultation",
      description: "Opening WhatsApp for your consultation.",
      duration: 3000,
    });
  };
  
  const handleSchedule = () => {
    toast({
      title: "Schedule Appointment",
      description: "Opening our appointment calendar.",
      duration: 3000,
    });
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`py-24 ${isDarkMode ? 'bg-gradient-dark' : 'bg-gradient-light'} relative overflow-hidden`}>
      {/* Enhanced animated gradient with better contrast */}
      <AnimatedGradient />
      
      {/* Enhanced background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40 z-0"></div>
      
      <div className="container-custom text-center relative z-10">
        {/* Enhanced heading with better animations and visibility */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className={`text-3xl md:text-5xl font-medium mb-8 ${isDarkMode ? 'text-white text-shadow-lg' : 'text-peak-black'}`}
        >
          Ready for Your <span className={`text-shimmer ${isDarkMode ? 'text-white' : ''}`}>Smile Transformation?</span>
        </motion.h2>
        
        {/* Enhanced paragraph with better visibility */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className={`mb-12 max-w-2xl mx-auto text-lg leading-relaxed ${isDarkMode ? 'text-white text-shadow-md' : 'text-peak-gray-700'}`}
        >
          Take the first step towards the smile you've always dreamed of. Contact us today to schedule your consultation with our award-winning specialists.
        </motion.p>
        
        {/* Enhanced button section with better animations and interaction */}
        <div className="flex flex-wrap justify-center gap-6 stagger-children">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hover-pulse-highlight"
          >
            <Button 
              ref={callButtonRef}
              size="lg" 
              onClick={handleCallNow}
              className={`${isDarkMode ? 'bg-white text-peak-black hover:bg-peak-gray-200' : 'bg-peak-black text-white hover:bg-peak-gray-800'} px-8 py-4 flex items-center gap-2 hover-lift button-3d ripple-button`}
            >
              <Phone size={18} className={`${isCallHovering ? 'animate-pulse' : ''}`} />
              <span>Call Now</span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hover-lift"
          >
            <Button 
              ref={whatsappButtonRef}
              size="lg" 
              variant="outline" 
              onClick={handleWhatsApp}
              className={`${isDarkMode ? 'border-white text-white hover:bg-white hover:text-peak-black' : 'border-peak-black text-peak-black hover:bg-peak-black hover:text-white'} px-8 py-4 flex items-center gap-2 button-3d ripple-button`}
            >
              <MessageSquare size={18} className={`${isWhatsappHovering ? 'animate-pulse' : ''}`} />
              <span>WhatsApp Consultation</span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hover-lift"
          >
            <Button 
              ref={calendarButtonRef}
              size="lg" 
              variant={isDarkMode ? "default" : "outline"}
              onClick={handleSchedule}
              className={`${isDarkMode ? 'bg-white/90 text-peak-black hover:bg-white' : 'border-peak-black text-peak-black hover:bg-peak-black/90 hover:text-white'} px-8 py-4 flex items-center gap-2 button-3d ripple-button`}
            >
              <Calendar size={18} className={`${isCalendarHovering ? 'animate-pulse' : ''}`} />
              <span>Schedule Appointment</span>
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </motion.div>
        </div>
        
        {/* New badge for added visual interest */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 inline-block"
        >
          <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-sm inline-flex items-center gap-2`}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className={`text-sm ${isDarkMode ? 'text-white/90' : 'text-black/80'}`}>Same-day emergency appointments available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
