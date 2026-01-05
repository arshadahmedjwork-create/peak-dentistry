
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Clock, Mail, MessageSquare, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/use-animations';

interface NotificationPreference {
  id: string;
  label: string;  // Using 'label' to match our updated interface
  description: string;
  checked: boolean;
  icon?: string;
}

interface NotificationSectionProps {
  notificationPreferences: NotificationPreference[];
  notificationsEnabled: Record<string, boolean>;
  onNotificationChange: (id: string, checked: boolean) => void;
}

const NotificationSection = ({ 
  notificationPreferences, 
  notificationsEnabled, 
  onNotificationChange 
}: NotificationSectionProps) => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'bell': return <Bell className="h-5 w-5 text-muted-foreground" />;
      case 'mail': return <Mail className="h-5 w-5 text-muted-foreground" />;
      case 'message': return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
      case 'phone': return <Phone className="h-5 w-5 text-muted-foreground" />;
      case 'clock': return <Clock className="h-5 w-5 text-muted-foreground" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    onNotificationChange(id, checked);
    
    toast({
      title: checked ? "Notification Enabled" : "Notification Disabled",
      description: `${checked ? "You will now receive" : "You will no longer receive"} notifications for ${notificationPreferences.find(p => p.id === id)?.label.toLowerCase()}.`
    });
  };

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className={`transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {Object.values(notificationsEnabled).some(val => val) ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
          <span>
            {Object.values(notificationsEnabled).filter(val => val).length} / {notificationPreferences.length} enabled
          </span>
        </div>
      </div>

      <div className="space-y-5 mt-4">
        {notificationPreferences.map((preference, index) => (
          <div 
            key={preference.id} 
            className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-all duration-300 hover:bg-accent/10
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-3">
              {getIcon(preference.icon)}
              <div>
                <Label htmlFor={preference.id} className="font-medium cursor-pointer">
                  {preference.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {preference.description}
                </p>
              </div>
            </div>
            <Switch
              id={preference.id}
              checked={notificationsEnabled[preference.id]}
              onCheckedChange={(checked) => handleNotificationChange(preference.id, checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSection;
