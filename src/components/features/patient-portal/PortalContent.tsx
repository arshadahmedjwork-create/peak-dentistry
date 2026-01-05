
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import DashboardTab from './DashboardTab';
import AppointmentsTab from './AppointmentsTab';
import TreatmentsTab from './TreatmentsTab';
import DocumentsViewOnly from './DocumentsViewOnly';
import BillingTab from './BillingTab';

interface PortalContentProps {
  upcomingAppointments: any[];
  pastAppointments: any[];
  treatmentHistory: any[];
  documents: any[];
  billingHistory: any[];
  userProfile: any;
  onCalendlySync: () => void;
  onAppointmentUpdate?: () => void;
}

const PortalContent = ({
  upcomingAppointments,
  pastAppointments,
  treatmentHistory,
  documents,
  billingHistory,
  userProfile,
  onCalendlySync,
  onAppointmentUpdate
}: PortalContentProps) => {
  return (
    <div className="p-6">
      <TabsContent value="dashboard" className="m-0">
        <DashboardTab 
          upcomingAppointments={upcomingAppointments} 
          onCalendlySync={onCalendlySync}
        />
      </TabsContent>
      
      <TabsContent value="appointments" className="m-0">
        <AppointmentsTab 
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          treatmentHistory={treatmentHistory}
          userProfile={userProfile}
          onCalendlySync={onCalendlySync}
          onAppointmentUpdate={onAppointmentUpdate}
        />
      </TabsContent>
      
      <TabsContent value="treatments" className="m-0">
        <TreatmentsTab treatmentHistory={treatmentHistory} />
      </TabsContent>
      
      <TabsContent value="documents" className="m-0">
        <DocumentsViewOnly documents={documents} />
      </TabsContent>
      
      <TabsContent value="billing" className="m-0">
        <BillingTab billingHistory={billingHistory} />
      </TabsContent>
    </div>
  );
};

export default PortalContent;
