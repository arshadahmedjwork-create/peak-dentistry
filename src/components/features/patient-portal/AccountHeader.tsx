
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Bell, Calendar, Mail } from "lucide-react";
import { useTheme } from '@/hooks/use-theme';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/hooks/use-supabase-data';
import { format } from 'date-fns';

interface AccountHeaderProps {
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

const AccountHeader = ({ onLogout, userName = "John Doe", userEmail = "Patient #12345" }: AccountHeaderProps) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { appointments } = useAppointments();
  
  // Get next upcoming appointment
  const nextAppointment = appointments
    ?.filter(apt => apt.status === 'scheduled' && apt.date && apt.time)
    ?.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
    : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png";

  // Get initials from the user name for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-lg shadow-md p-4 md:p-6 mb-8`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className={`h-16 w-16 border-2 ${theme === 'dark' ? 'border-white/30' : 'border-primary/30'} shadow-md transition-transform hover:scale-105 duration-300`}>
              <AvatarImage src="https://i.pravatar.cc/150?u=1" alt={userName} className="object-cover" />
              <AvatarFallback className={`${theme === 'dark' ? 'bg-primary/30 text-white' : 'bg-primary/10 text-primary'} font-bold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div>
            <CardTitle className={`${theme === 'dark' ? 'text-white text-shadow-md' : ''} text-xl md:text-2xl flex items-center gap-2`}>
              {userName}
              <Badge variant="outline" className="text-xs font-normal ml-2 hidden md:inline-flex">Active Patient</Badge>
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {userEmail}
              </span>
            </CardDescription>
            
            <div className="flex gap-3 mt-2">
              {nextAppointment && nextAppointment.date && nextAppointment.time && (
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Next: {format(new Date(`${nextAppointment.date} ${nextAppointment.time}`), 'MMM d, h:mm a')}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                <Bell className="h-3 w-3 mr-1" />
                {appointments?.length || 0} Appointments
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <img src={logoSrc} alt="PEAK DENTISTRY" className="h-10 hidden md:block" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout} 
            className={`${
              theme === 'dark' 
                ? 'border-white/20 text-white bg-white/5 hover:bg-white/10' 
                : 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10'
            } transition-all duration-300`}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
