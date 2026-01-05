
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, X, Calendar, Users, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

// Helper function to convert date to relative time
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

interface AdminHeaderProps {
  currentAdmin: {
    name: string;
    role: string;
    avatar?: string;
  };
  handleMobileMenu: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentAdmin, handleMobileMenu }) => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new appointments
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: 'status=eq.pending_confirmation'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch pending appointments
      const { data: pendingAppointments } = await supabase
        .from('appointments')
        .select('*, profiles(first_name, last_name)')
        .eq('status', 'pending_confirmation')
        .order('created_at', { ascending: false })
        .limit(5);

      const notifs: any[] = [];

      if (pendingAppointments) {
        pendingAppointments.forEach((apt: any) => {
          notifs.push({
            id: apt.id,
            type: 'appointment',
            title: 'New Appointment Request',
            message: `${apt.profiles?.first_name} ${apt.profiles?.last_name} requested an appointment`,
            time: getRelativeTime(apt.created_at),
            unread: true,
            link: '/admin/appointments'
          });
        });
      }

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => n.unread).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read and navigate
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-background border-b h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={handleMobileMenu}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center">
          <img 
            src={theme === 'dark' 
              ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
              : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png"}
            alt="Peak Dentistry" 
            className="h-8 mr-2" 
          />
          <span className="hidden md:inline-block font-bold text-xl">Peak Dentistry</span>
          <span className="ml-2 text-sm text-muted-foreground hidden md:inline-block">Admin Portal</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <Link 
                      key={notification.id} 
                      to={notification.link}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                        <div className={`mt-1 ${notification.type === 'appointment' ? 'text-blue-500' : 'text-amber-500'}`}>
                          {notification.type === 'appointment' ? (
                            <Calendar className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-center justify-center text-sm text-primary cursor-pointer"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentAdmin.avatar} alt={currentAdmin.name} />
            <AvatarFallback>{getInitials(currentAdmin.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentAdmin.name}</p>
            <p className="text-xs text-muted-foreground">{currentAdmin.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// Import for the Menu icon
import { Menu } from 'lucide-react';

export default AdminHeader;
