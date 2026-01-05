
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

interface BookingStepOneProps {
  services: Service[];
  selectedService: string;
  onSelectService: (serviceId: string) => void;
}

const BookingStepOne = ({ services, selectedService, onSelectService }: BookingStepOneProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <Card 
          key={service.id}
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            selectedService === service.id ? "border-2 border-primary" : ""
          }`}
          onClick={() => onSelectService(service.id)}
        >
          <CardHeader className="p-4">
            <CardTitle className="text-lg">{service.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">{service.duration}</p>
              <p className="font-medium">{service.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingStepOne;
