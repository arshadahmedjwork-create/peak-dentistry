
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Sun, Moon, Phone, BookOpen, MessageSquare, Copy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FeaturePanelProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  togglePanel: () => void;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ isDarkMode, toggleTheme, togglePanel }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const phoneNumber = "+91 73 73 044 044";
  
  const handleBookAppointment = () => {
    togglePanel();
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCopyPhoneNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: "Phone number copied!",
      description: "The number has been copied to your clipboard.",
      duration: 3000,
    });
  };
  
  const handleBlogAccess = () => {
    togglePanel();
    navigate('/blog');
  };

  const handleChatSupport = () => {
    togglePanel();
    toast({
      title: "Chat Support",
      description: "Our specialists will be with you shortly!",
      duration: 3000,
    });
  };
  
  return (
    <motion.div
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 w-72 rounded-2xl shadow-xl p-5",
        isDarkMode ? "bg-gradient-dark text-white" : "bg-gradient-light text-peak-black"
      )}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={cn(
          "text-lg font-medium",
          isDarkMode ? "text-white" : "text-peak-black"
        )}>Peak Features</h3>
        <button 
          onClick={togglePanel}
          className={cn(
            "hover-lift",
            isDarkMode ? "text-peak-gray-300 hover:text-white" : "text-peak-gray-600 hover:text-peak-black"
          )}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <Button 
          className={cn(
            "w-full flex items-center gap-2 hover-lift",
            isDarkMode ? "bg-white text-peak-black hover:bg-peak-gray-200" : "bg-peak-black text-white hover:bg-peak-gray-800"
          )}
          onClick={handleBookAppointment}
        >
          <Calendar className="w-4 h-4" />
          Book Your Appointment
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center justify-center gap-1",
              isDarkMode ? "border-white/70 text-white hover:bg-white/10" : "border-peak-black/70 text-peak-black hover:bg-peak-black/10"
            )}
            onClick={() => setShowPhoneNumber(!showPhoneNumber)}
          >
            <Phone className="w-4 h-4" />
            <span className="text-xs">Call Us</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center justify-center gap-1",
              isDarkMode ? "border-white/70 text-white hover:bg-white/10" : "border-peak-black/70 text-peak-black hover:bg-peak-black/10"
            )}
            onClick={handleBlogAccess}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Blog</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "flex items-center justify-center gap-1 col-span-2",
              isDarkMode ? "border-white/70 text-white hover:bg-white/10" : "border-peak-black/70 text-peak-black hover:bg-peak-black/10"
            )}
            onClick={handleChatSupport}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">Chat with Specialist</span>
          </Button>
        </div>
        
        {showPhoneNumber && (
          <motion.div 
            className={cn(
              "p-3 rounded-lg flex items-center justify-between",
              isDarkMode ? "bg-white/10" : "bg-peak-black/10"
            )}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-sm font-medium">{phoneNumber}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleCopyPhoneNumber}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
        
        <div className={cn(
          "flex items-center justify-between p-3 rounded-xl",
          isDarkMode ? "bg-black/20" : "bg-white/50"
        )}>
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className={cn(
                isDarkMode ? "text-peak-gray-300" : "text-peak-gray-600"
              )} size={18} />
            ) : (
              <Sun className={cn(
                isDarkMode ? "text-peak-gray-300" : "text-peak-gray-600"
              )} size={18} />
            )}
            <span className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-peak-gray-200" : "text-peak-gray-800"
            )}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            className={cn(
              "data-[state=checked]:bg-peak-black dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturePanel;
