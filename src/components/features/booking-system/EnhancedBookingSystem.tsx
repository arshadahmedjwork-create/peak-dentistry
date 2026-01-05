import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';

// Import data
import { timeSlots, services, dentists } from './BookingData';

// Import components
import BookingStepOne from './BookingStepOne';
import BookingStepTwo from './BookingStepTwo';
import BookingStepThree from './BookingStepThree';
import BookingStepFour from './BookingStepFour';
import BookingConfirmation from './BookingConfirmation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isNewPatient: boolean;
  insuranceProvider: string;
  notes: string;
}

const EnhancedBookingSystem = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDentist, setSelectedDentist] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isNewPatient: false,
    insuranceProvider: "",
    notes: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentist(dentistId);
    setStep(3);
  };

  const handleSelectDateTime = () => {
    if (selectedDate && selectedTime) {
      setStep(4);
    } else {
      toast({
        title: "Selection Required",
        description: "Please select both a date and time to continue.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isNewPatient: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, insuranceProvider: value }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleConfirmBooking = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsBooked(true);
      toast({
        title: "Appointment Confirmed!",
        description: `Your appointment has been scheduled for ${selectedDate?.toLocaleDateString()} at ${selectedTime}.`,
      });
    }, 2000);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService("");
    setSelectedDentist("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      isNewPatient: false,
      insuranceProvider: "",
      notes: "",
    });
    setIsBooked(false);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dateString = selectedDate.toISOString().split('T')[0];
    return timeSlots[dateString] || [];
  };

  const getSelectedServiceInfo = () => {
    return services.find(service => service.id === selectedService);
  };

  const getSelectedDentistInfo = () => {
    return dentists.find(dentist => dentist.id === selectedDentist);
  };

  if (isBooked) {
    return (
      <BookingConfirmation 
        formData={formData}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedServiceName={getSelectedServiceInfo()?.name || ""}
        selectedDentistName={getSelectedDentistInfo()?.name || ""}
        onReset={handleReset}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule Your Dental Appointment</CardTitle>
        <CardDescription>
          Book your next dental visit in just a few steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={`step-${step}`} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger 
              value="step-1" 
              disabled={step !== 1} 
              className={step > 1 ? "bg-green-100 text-green-700" : ""}
            >
              Service
            </TabsTrigger>
            <TabsTrigger 
              value="step-2" 
              disabled={step !== 2} 
              className={step > 2 ? "bg-green-100 text-green-700" : ""}
            >
              Dentist
            </TabsTrigger>
            <TabsTrigger 
              value="step-3" 
              disabled={step !== 3} 
              className={step > 3 ? "bg-green-100 text-green-700" : ""}
            >
              Date & Time
            </TabsTrigger>
            <TabsTrigger 
              value="step-4" 
              disabled={step !== 4} 
              className={step > 4 ? "bg-green-100 text-green-700" : ""}
            >
              Your Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="space-y-4">
            <BookingStepOne 
              services={services}
              selectedService={selectedService}
              onSelectService={handleSelectService}
            />
          </TabsContent>

          <TabsContent value="step-2" className="space-y-4">
            <BookingStepTwo 
              dentists={dentists}
              selectedDentist={selectedDentist}
              onSelectDentist={handleSelectDentist}
              onBack={() => setStep(1)}
            />
          </TabsContent>

          <TabsContent value="step-3" className="space-y-4">
            <BookingStepThree 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              onContinue={handleSelectDateTime}
              onBack={() => setStep(2)}
              getAvailableTimeSlots={getAvailableTimeSlots}
            />
          </TabsContent>

          <TabsContent value="step-4" className="space-y-6">
            <BookingStepFour 
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleSelectChange={handleSelectChange}
              handleNotesChange={handleNotesChange}
              handleConfirmBooking={handleConfirmBooking}
              onBack={() => setStep(3)}
              isConfirming={isConfirming}
              selectedService={selectedService}
              selectedDentist={selectedDentist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              getSelectedServiceInfo={getSelectedServiceInfo}
              getSelectedDentistInfo={getSelectedDentistInfo}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedBookingSystem;
