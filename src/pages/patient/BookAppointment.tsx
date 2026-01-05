import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, Clock } from 'lucide-react';
import { z } from 'zod';

const appointmentSchema = z.object({
  appointmentType: z.string().min(1, 'Please select an appointment type'),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
});

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    appointmentType: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const appointmentTypes = [
    'Regular Checkup',
    'Cleaning',
    'Cavity Filling',
    'Root Canal',
    'Crown/Bridge',
    'Teeth Whitening',
    'Orthodontics Consultation',
    'Emergency Care',
    'Other'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }

    const result = appointmentSchema.safeParse({
      ...formData,
      date
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    // Create appointment directly in appointments table with pending_confirmation status
    const { error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        appointment_type: formData.appointmentType,
        appointment_date: date?.toISOString().split('T')[0],
        appointment_time: formData.time,
        notes: formData.notes,
        status: 'pending_confirmation',
        dentist_name: '' // Will be assigned by admin
      });

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Format date for display
      const formattedDate = date?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      toast({
        title: "✓ Appointment Request Submitted",
        description: `Your appointment request for ${formData.appointmentType} on ${formattedDate} at ${formData.time} is awaiting confirmation from our admin team.`
      });
      navigate('/patient/dashboard');
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="container-custom py-28">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Book an Appointment</h1>
            <p className="text-muted-foreground mt-2">
              Schedule your next dental visit with us
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Fill in the details below and we'll confirm your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select
                    value={formData.appointmentType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.appointmentType && (
                    <p className="text-sm text-red-500">{errors.appointmentType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <div className="rounded-md border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <p className="text-sm text-red-500">{errors.time}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific concerns or requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    disabled={loading}
                    rows={4}
                  />
                  {errors.notes && (
                    <p className="text-sm text-red-500">{errors.notes}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/patient/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
