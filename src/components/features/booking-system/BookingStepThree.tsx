
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";

interface BookingStepThreeProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  onContinue: () => void;
  onBack: () => void;
  getAvailableTimeSlots: () => string[];
}

const BookingStepThree = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime, 
  onContinue, 
  onBack,
  getAvailableTimeSlots
}: BookingStepThreeProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4 font-medium">Select a Date</h3>
          <div className="border rounded-md p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => {
                const dateString = date.toISOString().split('T')[0];
                // Disable weekends and dates with no time slots
                return date < new Date() || 
                       date.getDay() === 0 || 
                       date.getDay() === 6 ||
                       !getAvailableTimeSlots().length;
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-medium">Select a Time</h3>
          <div className={`grid grid-cols-2 gap-2 ${!selectedDate ? 'opacity-50' : ''}`}>
            {selectedDate ? (
              getAvailableTimeSlots().length > 0 ? (
                getAvailableTimeSlots().map((time) => (
                  <Button 
                    key={time} 
                    variant={selectedTime === time ? "default" : "outline"}
                    className="justify-start text-left"
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </Button>
                ))
              ) : (
                <p className="col-span-2 text-center py-8 text-muted-foreground">
                  No available time slots for the selected date.
                </p>
              )
            ) : (
              <p className="col-span-2 text-center py-8 text-muted-foreground">
                Please select a date first
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </>
  );
};

export default BookingStepThree;
