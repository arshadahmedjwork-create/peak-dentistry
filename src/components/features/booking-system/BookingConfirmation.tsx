
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isNewPatient: boolean;
  insuranceProvider: string;
  notes: string;
}

interface BookingConfirmationProps {
  formData: FormData;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedServiceName: string;
  selectedDentistName: string;
  onReset: () => void;
}

const BookingConfirmation = ({ 
  formData, 
  selectedDate, 
  selectedTime, 
  selectedServiceName, 
  selectedDentistName,
  onReset 
}: BookingConfirmationProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        <CardDescription>
          We've sent a confirmation to your email with all the details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Appointment Details</h3>
              <p className="flex items-center gap-2 mt-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{selectedDate?.toLocaleDateString()}</span>
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedTime}</span>
              </p>
              <p className="mt-1">Service: {selectedServiceName}</p>
              <p className="mt-1">Dentist: {selectedDentistName}</p>
            </div>
            <div>
              <h3 className="font-medium">Your Information</h3>
              <p className="mt-2">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="mt-1">{formData.email}</p>
              <p className="mt-1">{formData.phone}</p>
              <p className="mt-1">
                {formData.isNewPatient ? "New Patient" : "Existing Patient"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need to make changes? Please call us at (555) 123-4567 at least 24 hours
            before your appointment.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onReset}>
          Book Another Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
