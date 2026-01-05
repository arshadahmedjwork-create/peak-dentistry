
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

interface ProfileSectionProps {
  userProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

const ProfileSection = ({ userProfile, onProfileChange }: ProfileSectionProps) => {
  const [date, setDate] = useState<Date | undefined>(
    userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : undefined
  );

  useEffect(() => {
    if (userProfile.dateOfBirth) {
      setDate(new Date(userProfile.dateOfBirth));
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProfileChange({ ...userProfile, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    onProfileChange({ ...userProfile, [name]: value });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onProfileChange({ ...userProfile, dateOfBirth: format(newDate, "yyyy-MM-dd") });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium">Profile Information</h3>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              name="firstName"
              value={userProfile.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              name="lastName"
              value={userProfile.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            value={userProfile.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone"
            value={userProfile.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ScrollArea className="h-80 w-auto rounded-md">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            name="address"
            value={userProfile.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input 
            id="emergencyContact" 
            name="emergencyContact"
            value={userProfile.emergencyContact}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Select
            value={userProfile.insuranceProvider}
            onValueChange={(value) => handleSelectChange(value, "insuranceProvider")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select insurance provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aetna">Aetna</SelectItem>
              <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
              <SelectItem value="cigna">Cigna</SelectItem>
              <SelectItem value="delta">Delta Dental</SelectItem>
              <SelectItem value="humana">Humana</SelectItem>
              <SelectItem value="metlife">MetLife</SelectItem>
              <SelectItem value="unitedhealth">UnitedHealthcare</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="none">None / Self-Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceNumber">Insurance ID/Number</Label>
          <Input 
            id="insuranceNumber" 
            name="insuranceNumber"
            value={userProfile.insuranceNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
