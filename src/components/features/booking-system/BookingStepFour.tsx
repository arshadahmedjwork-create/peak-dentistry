
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isNewPatient: boolean;
  insuranceProvider: string;
  notes: string;
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

interface Dentist {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface BookingStepFourProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleSelectChange: (value: string) => void;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleConfirmBooking: () => void;
  onBack: () => void;
  isConfirming: boolean;
  selectedService: string;
  selectedDentist: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  getSelectedServiceInfo: () => Service | undefined;
  getSelectedDentistInfo: () => Dentist | undefined;
}

const BookingStepFour = ({ 
  formData, 
  handleInputChange, 
  handleCheckboxChange, 
  handleSelectChange, 
  handleNotesChange,
  handleConfirmBooking,
  onBack,
  isConfirming,
  selectedDate,
  selectedTime,
  getSelectedServiceInfo,
  getSelectedDentistInfo
}: BookingStepFourProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isNewPatient" 
            checked={formData.isNewPatient}
            onCheckedChange={handleCheckboxChange}
          />
          <label 
            htmlFor="isNewPatient" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I am a new patient
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="insurance">Insurance Provider (optional)</Label>
        <Select value={formData.insuranceProvider} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your insurance provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aetna">Aetna</SelectItem>
            <SelectItem value="cigna">Cigna</SelectItem>
            <SelectItem value="delta">Delta Dental</SelectItem>
            <SelectItem value="metlife">MetLife</SelectItem>
            <SelectItem value="unitedhealth">UnitedHealthcare</SelectItem>
            <SelectItem value="none">None / Self-Pay</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (optional)</Label>
        <textarea 
          id="notes"
          value={formData.notes}
          onChange={handleNotesChange}
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Please share any specific concerns or questions you have for your appointment."
        />
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Appointment Summary</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Service:</strong> {getSelectedServiceInfo()?.name}</p>
          <p><strong>Dentist:</strong> {getSelectedDentistInfo()?.name}</p>
          <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button 
          onClick={handleConfirmBooking}
          disabled={isConfirming || !formData.firstName || !formData.lastName || !formData.email || !formData.phone}
        >
          {isConfirming ? (
            <>
              <div className="spinner mr-2"></div>
              Confirming...
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookingStepFour;
