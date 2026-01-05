
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AppointmentBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
}

const AppointmentBookingForm = ({ isOpen, onClose, userProfile }: AppointmentBookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dental services
  const dentalServices = [
    { id: "cleaning", name: "Regular Cleaning & Check-up" },
    { id: "whitening", name: "Teeth Whitening" },
    { id: "filling", name: "Dental Filling" },
    { id: "rootcanal", name: "Root Canal" },
    { id: "extraction", name: "Tooth Extraction" },
    { id: "crown", name: "Dental Crown" },
    { id: "consultation", name: "General Consultation" }
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      toast({
        title: "Incomplete Information",
        description: "Please select a date, time, and service to book your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before booking.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const service = dentalServices.find(s => s.id === selectedService);
      
      // Import supabase and useAuth
      const { supabase } = await import('@/integrations/supabase/client');
      const { useAuth } = await import('@/hooks/use-auth');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save to database with pending_confirmation status
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        appointment_type: service?.name || selectedService,
        dentist_name: 'To be assigned',
        notes: '',
        status: 'pending_confirmation'
      });

      if (error) throw error;
      
      toast({
        title: "✓ Appointment Request Submitted",
        description: `Your appointment request for ${service?.name} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} is awaiting confirmation from our admin team.`,
      });
      
      onClose();
      
      // Reset form after successful booking
      setSelectedDate(undefined);
      setSelectedTime(null);
      setSelectedService(null);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to process your appointment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulated available time slots
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    // Simplified time slot generation based on day of week
    const day = selectedDate.getDay();
    if (day === 0) return []; // No slots on Sunday
    
    const morningSlots = ["9:00 AM", "10:00 AM", "11:00 AM"];
    const afternoonSlots = ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
    
    // Fewer slots on Saturday
    return day === 6 ? morningSlots : [...morningSlots, ...afternoonSlots];
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-white">Select Date</h3>
          <div className="border border-white/20 rounded-xl overflow-hidden bg-white/5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                // Disable past dates, Sundays, and the next 7 days (for demo)
                return date < new Date() || 
                       date.getDay() === 0 || 
                       date > new Date(new Date().setDate(new Date().getDate() + 60));
              }}
              className={cn("p-3 pointer-events-auto text-white")}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Select Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedDate ? (
                getAvailableTimeSlots().length > 0 ? (
                  getAvailableTimeSlots().map((time) => (
                    <Button 
                      key={time} 
                      variant={selectedTime === time ? "default" : "outline"}
                      className="justify-start text-left"
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-2 text-center py-8 text-white/60">
                    No available times on this date.
                  </p>
                )
              ) : (
                <p className="col-span-2 text-center py-8 text-white/60">
                  Please select a date first
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Select Service</h3>
            <div className="space-y-2">
              {dentalServices.map((service) => (
                <Button 
                  key={service.id} 
                  variant={selectedService === service.id ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedService(service.id)}
                >
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {userProfile && (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h3 className="text-sm font-medium mb-2 text-white">Booking for</h3>
          <p className="text-sm text-white/90">{userProfile.firstName} {userProfile.lastName}</p>
          <p className="text-sm text-white/80">{userProfile.phone}</p>
          <p className="text-sm text-white/80">{userProfile.email}</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleBookAppointment} disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;
