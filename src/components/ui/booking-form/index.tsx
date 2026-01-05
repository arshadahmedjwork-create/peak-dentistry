
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import BookingFormSuccess from './BookingFormSuccess';
import CalendlyDialog from './CalendlyDialog';
import BookingFormFields from './BookingFormFields';
import { Loader2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the form schema with Zod for validation
const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string()
    .min(10, { message: "Please enter a valid phone number" })
    .refine((val) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), {
      message: "Please enter a valid phone number format",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal('')),
  service: z.string().min(1, { message: "Please select a service" }),
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  message: z.string().optional(),
  isUrgent: z.boolean().optional().default(false),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingFormValues | null>(null);
  const [showCalendlyOption, setShowCalendlyOption] = useState(false);
  const [bookingMethod, setBookingMethod] = useState<'form' | 'calendly'>('form');
  const [isCalendlyConnected, setIsCalendlyConnected] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      message: '',
      isUrgent: false,
    },
  });

  const handleSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.from('booking_requests').insert([
        {
          patient_name: values.name,
          email: values.email || null,
          phone: values.phone,
          service_type: values.service,
          preferred_date: values.date,
          preferred_time: values.time,
          message: values.message || null,
          status: 'pending',
        },
      ]);

      if (error) throw error;
      
      // Save submitted data for confirmation screen
      setSubmittedData(values);
      setSubmitted(true);
      
      // Display success toast
      toast({
        title: "Appointment Requested",
        description: "We'll contact you shortly to confirm your booking.",
      });
      
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalendlyConnection = () => {
    setIsCalendlyConnected(true);
    toast({
      title: "Calendly Connected",
      description: "Your booking system is now synced with Calendly. Appointments will be added to your calendar automatically.",
    });
    setShowCalendlyOption(false);
  };

  const handleStartOver = () => {
    setSubmitted(false);
    form.reset();
  };

  return (
    <div className="glass-dark p-8 rounded-xl border border-peak-gray-200 shadow-lg max-w-md w-full mx-auto">
      {submitted ? (
        <BookingFormSuccess 
          appointmentData={submittedData} 
          onStartOver={handleStartOver}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Book Your Appointment</h3>
            {!isCalendlyConnected && (
              <CalendlyDialog onConnect={handleCalendlyConnection} />
            )}
          </div>
          
          {isCalendlyConnected ? (
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="form">
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Form
                </TabsTrigger>
                <TabsTrigger value="calendly">
                  <Calendar className="mr-2 h-4 w-4" />
                  Direct Booking
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form">
                <BookingFormFields 
                  form={form}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
              
              <TabsContent value="calendly">
                <div className="border rounded-md p-4 h-[400px] overflow-y-auto flex items-center justify-center bg-gray-50">
                  <div className="text-center p-6">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="font-medium mb-2">Calendly Integration</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Your Calendly is connected. In a real implementation, the Calendly booking widget would appear here.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Click the button below to view booking options
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <BookingFormFields 
              form={form}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookingForm;
