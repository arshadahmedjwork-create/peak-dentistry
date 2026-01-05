
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, Clock, Link as LinkIcon } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  dentist: string;
  notes: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onCalendlySync?: () => void;
  onAppointmentUpdated?: () => void;
}

const UpcomingAppointments = ({ appointments, onCalendlySync, onAppointmentUpdated }: UpcomingAppointmentsProps) => {
  const navigate = useNavigate();
  
  const handleReschedule = (appointmentId: string) => {
    toast({
      title: "Reschedule Request Sent",
      description: "We'll contact you shortly to confirm a new appointment time.",
    });
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Canceled",
        description: "Your appointment has been successfully canceled.",
      });

      // Refresh appointments list
      if (onAppointmentUpdated) {
        onAppointmentUpdated();
      }
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Unable to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Appointments
        </CardTitle>
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
            <div className="py-4">
              <div className="rounded-md bg-muted p-4 mb-4">
                <p className="text-sm">
                  Connecting with Calendly allows you to:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Sync existing appointments</li>
                  <li>Book new appointments with real-time availability</li>
                  <li>Receive automatic reminders</li>
                  <li>Easily reschedule when needed</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="calendlyUrl" className="text-sm font-medium">
                    Your Calendly URL
                  </label>
                  <input
                    id="calendlyUrl"
                    placeholder="https://calendly.com/yourusername"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <Button className="w-full" onClick={onCalendlySync}>
                  Connect Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{appointment.type}</h4>
                    <Badge 
                      variant={
                        appointment.status === 'pending_confirmation' ? 'outline' :
                        appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'default' :
                        appointment.status === 'completed' ? 'secondary' : 'outline'
                      }
                      className={
                        appointment.status === 'pending_confirmation' ? 'border-amber-500 text-amber-600' : ''
                      }
                    >
                      {appointment.status === 'pending_confirmation' ? 'Awaiting Confirmation' : 
                       appointment.status === 'scheduled' ? 'Scheduled' :
                       appointment.status === 'confirmed' ? 'Confirmed' :
                       appointment.status === 'completed' ? 'Completed' : appointment.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 mt-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {appointment.time}
                    </span>
                    {appointment.dentist && <span className="mt-1">Dr. {appointment.dentist}</span>}
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCancel(appointment.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming appointments</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/patient/book-appointment')}>
              Schedule Appointment
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate('/patient/dashboard')}>
          View All Appointments
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingAppointments;
