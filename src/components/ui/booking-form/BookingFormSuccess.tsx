
import React from 'react';
import { Check, Calendar, Clock, User, Phone, MessageSquare, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingFormSuccessProps {
  appointmentData: any;
  onStartOver: () => void;
}

const BookingFormSuccess = ({ appointmentData, onStartOver }: BookingFormSuccessProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeId: string) => {
    const timeMap: Record<string, string> = {
      'morning': 'Morning (9:00 AM - 12:00 PM)',
      'afternoon': 'Afternoon (12:00 PM - 3:00 PM)',
      'evening': 'Evening (3:00 PM - 7:00 PM)',
    };
    return timeMap[timeId] || timeId || 'Not specified';
  };

  const formatService = (serviceId: string) => {
    const serviceMap: Record<string, string> = {
      'smile-design': 'Smile Design & Makeover',
      'cosmetic-dentistry': 'Cosmetic Dentistry',
      'implantology': 'Implantology & Full Mouth Rehab',
      'laser-dentistry': 'Laser Dentistry',
      'pediatric-dentistry': 'Pediatric & Preventive Dentistry',
      'general-dentistry': 'General Dentistry',
      'emergency-care': 'Emergency Dental Care',
      'teeth-whitening': 'Professional Teeth Whitening',
    };
    return serviceMap[serviceId] || serviceId || 'Not specified';
  };
  
  const getNextSteps = () => {
    return [
      "We'll review your appointment request and contact you to confirm",
      "Prepare any previous dental records or x-rays if available",
      "Arrive 15 minutes before your appointment time",
      "Feel free to call us if you have any questions before your visit"
    ];
  };

  return (
    <div className="py-4 animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
        <Check className="text-white" size={32} />
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-center">Thank You!</h3>
      <p className="text-peak-gray-600 mb-6 text-center">
        Your appointment request has been received. We'll contact you shortly to confirm your booking.
      </p>
      
      {appointmentData && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3 text-center">Appointment Details</h4>
            
            {appointmentData.isUrgent && (
              <div className="mb-3 flex justify-center">
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgent Appointment
                </Badge>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="text-primary mr-3 flex-shrink-0" size={16} />
                <span className="text-sm">{appointmentData.name}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-primary mr-3 flex-shrink-0" size={16} />
                <span className="text-sm">{appointmentData.phone}</span>
              </div>
              
              {appointmentData.email && (
                <div className="flex items-center">
                  <Mail className="text-primary mr-3 flex-shrink-0" size={16} />
                  <span className="text-sm">{appointmentData.email}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="text-primary mr-3 flex-shrink-0" size={16} />
                <span className="text-sm">{formatDate(appointmentData.date)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="text-primary mr-3 flex-shrink-0" size={16} />
                <span className="text-sm">{formatTime(appointmentData.time)}</span>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="text-primary mr-3 mt-1 flex-shrink-0" size={16} />
                <div>
                  <div className="text-sm font-medium">Service</div>
                  <div className="text-sm">{formatService(appointmentData.service)}</div>
                </div>
              </div>
              
              {appointmentData.message && (
                <div className="flex items-start">
                  <MessageSquare className="text-primary mr-3 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <div className="text-sm font-medium">Your Message</div>
                    <div className="text-sm">{appointmentData.message}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h5 className="font-medium mb-2">Next Steps:</h5>
        <ul className="space-y-2">
          {getNextSteps().map((step, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center" 
          onClick={onStartOver}
        >
          Book Another Appointment
        </Button>
        
        <div className="flex justify-between">
          <a 
            href="/services" 
            className="block w-full text-center text-sm text-peak-gray-700 hover:text-peak-black transition-colors"
          >
            View Our Services
            <ArrowRight className="inline-block ml-1 h-3 w-3" />
          </a>
          
          <a 
            href="/blog" 
            className="block w-full text-center text-sm text-peak-gray-700 hover:text-peak-black transition-colors"
          >
            Read Dental Tips
            <ArrowRight className="inline-block ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingFormSuccess;
