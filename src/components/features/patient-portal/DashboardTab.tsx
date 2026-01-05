
import React from 'react';
import DashboardLayout from './dashboard/DashboardLayout';

interface DashboardTabProps {
  upcomingAppointments: any[];
  onCalendlySync: () => void;
}

const DashboardTab = ({ upcomingAppointments, onCalendlySync }: DashboardTabProps) => {
  return (
    <DashboardLayout 
      upcomingAppointments={upcomingAppointments} 
      onCalendlySync={onCalendlySync}
    />
  );
};

export default DashboardTab;
