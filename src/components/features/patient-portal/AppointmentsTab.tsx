
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";

// Import refactored components
import UpcomingAppointmentsContent from "./appointments/UpcomingAppointmentsContent";
import PastAppointmentsContent from "./appointments/PastAppointmentsContent";
import AppointmentBookingForm from "./appointments/AppointmentBookingForm";
import CalendarSyncDialog from "./appointments/CalendarSyncDialog";

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  dentist: string;
  notes: string;
}

interface Treatment {
  id: number;
  date: string;
  procedure: string;
  dentist: string;
  details: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

interface AppointmentsTabProps {
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  treatmentHistory: Treatment[];
  userProfile?: UserProfile;
  onCalendlySync?: () => void;
  onAppointmentUpdate?: () => void;
}

const AppointmentsTab = ({ 
  upcomingAppointments,
  pastAppointments,
  treatmentHistory, 
  userProfile,
  onCalendlySync,
  onAppointmentUpdate
}: AppointmentsTabProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAppointmentUpdated = () => {
    if (onAppointmentUpdate) {
      onAppointmentUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect Calendly
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect with Calendly</DialogTitle>
                <DialogDescription>
                  Link your Calendly account to automatically sync your dental appointments.
                </DialogDescription>
              </DialogHeader>
              <CalendarSyncDialog onCalendlySync={onCalendlySync} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Book a New Appointment</DialogTitle>
                <DialogDescription>
                  Select your preferred date, time, and service for your dental appointment.
                </DialogDescription>
              </DialogHeader>
              <AppointmentBookingForm 
                isOpen={isBookingOpen} 
                onClose={() => setIsBookingOpen(false)}
                userProfile={userProfile}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <UpcomingAppointmentsContent 
                appointments={upcomingAppointments}
                formatDate={formatDate}
                onScheduleNow={() => setIsBookingOpen(true)}
                onAppointmentUpdated={handleAppointmentUpdated}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <PastAppointmentsContent 
                appointments={pastAppointments}
                treatments={treatmentHistory}
                formatDate={formatDate}
                onBookFollowUp={() => setIsBookingOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsTab;
