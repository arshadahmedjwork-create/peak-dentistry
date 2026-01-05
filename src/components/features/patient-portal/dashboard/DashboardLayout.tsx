
import React from 'react';
import UpcomingAppointments from '../UpcomingAppointments';
import NotificationsPanel from '../NotificationsPanel';
import OralHealthOverview from '../OralHealthOverview';
import QuickActions from '../QuickActions';
import DashboardWelcome from './DashboardWelcome';
import { useAuth } from '@/hooks/use-auth';
import { useProfile, useAppointments } from '@/hooks/use-supabase-data';

interface DashboardLayoutProps {
  upcomingAppointments: any[];
  onCalendlySync: () => void;
}

const DashboardLayout = ({ upcomingAppointments, onCalendlySync }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { refetch: refetchAppointments } = useAppointments();
  
  // Get user name from profile first, then fallback to user metadata, then email
  const userName = profile 
    ? `${profile.first_name} ${profile.last_name}`
    : user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email?.split('@')[0] || 'Guest';

  return (
    <div className="space-y-6">
      <DashboardWelcome userName={userName} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <UpcomingAppointments 
            appointments={upcomingAppointments} 
            onCalendlySync={onCalendlySync}
            onAppointmentUpdated={refetchAppointments}
          />
        </div>
        
        <div className="space-y-6">
          <NotificationsPanel />
          <OralHealthOverview />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
