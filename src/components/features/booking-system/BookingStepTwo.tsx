
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Dentist {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface BookingStepTwoProps {
  dentists: Dentist[];
  selectedDentist: string;
  onSelectDentist: (dentistId: string) => void;
  onBack: () => void;
}

const BookingStepTwo = ({ dentists, selectedDentist, onSelectDentist, onBack }: BookingStepTwoProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dentists.map((dentist) => (
          <Card 
            key={dentist.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedDentist === dentist.id ? "border-2 border-primary" : ""
            }`}
            onClick={() => onSelectDentist(dentist.id)}
          >
            <div className="p-4 flex gap-4 items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img 
                  src={dentist.image} 
                  alt={dentist.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{dentist.name}</h3>
                <p className="text-sm text-muted-foreground">{dentist.specialty}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
      </div>
    </>
  );
};

export default BookingStepTwo;
