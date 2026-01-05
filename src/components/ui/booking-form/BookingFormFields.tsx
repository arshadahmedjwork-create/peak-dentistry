
import React from 'react';
import { Calendar, Phone, MessageSquare, Loader2, Mail, AlertCircle, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Services data
const services = [
  { id: 'smile-design', name: 'Smile Design & Makeover' },
  { id: 'cosmetic-dentistry', name: 'Cosmetic Dentistry' },
  { id: 'implantology', name: 'Implantology & Full Mouth Rehab' },
  { id: 'laser-dentistry', name: 'Laser Dentistry' },
  { id: 'pediatric-dentistry', name: 'Pediatric & Preventive Dentistry' },
  { id: 'general-dentistry', name: 'General Dentistry' },
  { id: 'emergency-care', name: 'Emergency Dental Care' },
  { id: 'teeth-whitening', name: 'Professional Teeth Whitening' },
];

// Time slots data
const timeSlots = [
  { id: 'morning', name: 'Morning (9:00 AM - 12:00 PM)' },
  { id: 'afternoon', name: 'Afternoon (12:00 PM - 3:00 PM)' },
  { id: 'evening', name: 'Evening (3:00 PM - 7:00 PM)' },
];

interface BookingFormFieldsProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
}

const BookingFormFields = ({ form, onSubmit, isSubmitting }: BookingFormFieldsProps) => {
  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your name" 
                  {...field} 
                  className="w-full focus:border-peak-black transition-colors"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Your phone number" 
                      type="tel"
                      {...field} 
                      className="w-full pl-9 focus:border-peak-black transition-colors"
                      aria-required="true"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peak-gray-500" size={16} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Your email" 
                      type="email"
                      {...field} 
                      className="w-full pl-9 focus:border-peak-black transition-colors"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peak-gray-500" size={16} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full focus:border-peak-black transition-colors">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription className="text-xs">
                Select the dental service you're interested in
              </FormDescription>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="date" 
                      min={today}
                      {...field} 
                      className="w-full focus:border-peak-black transition-colors"
                      aria-required="true"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-peak-gray-500 pointer-events-none" size={16} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full focus:border-peak-black transition-colors">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Tell us about your dental concerns or any specific requirements"
                    className="w-full px-4 py-2 border border-peak-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peak-black resize-none min-h-[80px]"
                    {...field}
                  />
                  <MessageSquare className="absolute right-3 top-3 text-peak-gray-500" size={16} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isUrgent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Urgent Appointment</FormLabel>
                <FormDescription>
                  Check this box if you need an urgent appointment (within 24-48 hours)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 transition-all duration-300 relative"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Book Appointment"
          )}
        </Button>
        
        <div className="flex justify-center gap-6 pt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="tel:+919876543210" className="flex items-center text-sm text-peak-gray-700 hover:text-peak-black transition-colors">
                  <Phone size={16} className="mr-1" />
                  Call Now
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Call us directly for urgent appointments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="https://wa.me/919876543210" className="flex items-center text-sm text-peak-gray-700 hover:text-peak-black transition-colors">
                  <MessageSquare size={16} className="mr-1" />
                  WhatsApp
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Message us on WhatsApp for quick responses</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </Form>
  );
};

export default BookingFormFields;
