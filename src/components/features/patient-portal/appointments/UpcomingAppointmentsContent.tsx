
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  dentist: string;
  notes: string;
  status?: string;
}

interface UpcomingAppointmentsContentProps {
  appointments: Appointment[];
  formatDate: (dateString: string) => string;
  onScheduleNow: () => void;
  onAppointmentUpdated?: () => void;
}

const UpcomingAppointmentsContent = ({ appointments, formatDate, onScheduleNow, onAppointmentUpdated }: UpcomingAppointmentsContentProps) => {
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

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No upcoming appointments</p>
        <Button 
          className="mt-4"
          onClick={onScheduleNow}
        >
          Schedule Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
            <p className="mt-1 font-medium">{formatDate(appointment.date)}</p>
            <p>{appointment.time}</p>
            {appointment.status === 'pending_confirmation' && (
              <Badge variant="outline" className="mt-2 bg-yellow-50 text-yellow-700 border-yellow-300">
                Pending Confirmation
              </Badge>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Appointment Type</p>
            <p className="mt-1">{appointment.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dentist</p>
            <p className="mt-1">{appointment.dentist}</p>
          </div>
          <div className="flex gap-2 items-start md:justify-end">
            {appointment.status !== 'pending_confirmation' && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCancel(appointment.id)}>
                  Cancel
                </Button>
              </>
            )}
            {appointment.status === 'pending_confirmation' && (
              <Button variant="outline" size="sm" onClick={() => handleCancel(appointment.id)}>
                Cancel Request
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointmentsContent;
