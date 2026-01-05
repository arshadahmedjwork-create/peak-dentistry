
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  dentist: string;
  notes: string;
  status?: string;
}

interface Treatment {
  id: number;
  date: string;
  procedure: string;
  dentist: string;
  details: string;
}

interface PastAppointmentsContentProps {
  appointments: Appointment[];
  treatments: Treatment[];
  formatDate: (dateString: string) => string;
  onBookFollowUp: () => void;
}

const PastAppointmentsContent = ({ appointments, treatments, formatDate, onBookFollowUp }: PastAppointmentsContentProps) => {
  // Combine appointments and treatments for display
  const allPastItems = [
    ...appointments.map(apt => ({
      id: apt.id,
      date: apt.date,
      procedure: apt.type,
      dentist: apt.dentist,
      details: apt.notes || 'No additional notes',
      type: 'appointment' as const
    })),
    ...treatments.map(treatment => ({
      id: treatment.id.toString(),
      date: treatment.date,
      procedure: treatment.procedure,
      dentist: treatment.dentist,
      details: treatment.details,
      type: 'treatment' as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allPastItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No past appointments or treatments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allPastItems.slice(0, 10).map((item) => (
        <div key={`${item.type}-${item.id}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="mt-1">{formatDate(item.date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p className="mt-1">{item.procedure}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dentist</p>
            <p className="mt-1">{item.dentist}</p>
          </div>
          <div className="flex gap-2 items-start md:justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="link" className="px-0 mt-1 h-auto">View Details</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{item.type === 'appointment' ? 'Appointment' : 'Treatment'} Details</SheetTitle>
                  <SheetDescription>
                    {formatDate(item.date)}
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="font-medium">Procedure</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.procedure}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Dentist</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.dentist}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">Download Summary</Button>
                    <Button size="sm" onClick={onBookFollowUp}>Book Follow-up</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastAppointmentsContent;
