import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Calendar, Settings } from "lucide-react";
import SettingsModal from './SettingsModal';

interface PortalFooterProps {
  userProfile: any;
  notificationsEnabled: Record<string, boolean>;
  notificationPreferences: any[];
  onNotificationChange: (id: string, checked: boolean) => void;
  onProfileUpdate: (profileData: any) => void;
  onLogout: () => void;
  onDeleteAccount?: () => void;
  upcomingAppointments?: any[];
}

const PortalFooter = ({ 
  userProfile, 
  notificationsEnabled, 
  notificationPreferences, 
  onNotificationChange, 
  onProfileUpdate, 
  onLogout,
  onDeleteAccount,
  upcomingAppointments = []
}: PortalFooterProps) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Get next upcoming appointment
  const nextAppointment = upcomingAppointments
    .filter(apt => apt.status === 'scheduled' && apt.date && apt.time)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  
  const formatAppointmentDate = (apt: any) => {
    if (!apt || !apt.date || !apt.time) return 'No upcoming appointments';
    
    const date = new Date(`${apt.date} ${apt.time}`);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Next Appointment: {formatAppointmentDate(nextAppointment)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>Sign Out</Button>
        </div>
      </CardFooter>

      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        userProfile={userProfile}
        onProfileUpdate={onProfileUpdate}
        notificationPreferences={notificationPreferences}
        notificationsEnabled={notificationsEnabled}
        onNotificationChange={onNotificationChange}
        onDeleteAccount={onDeleteAccount}
      />
    </>
  );
};

export default PortalFooter;
