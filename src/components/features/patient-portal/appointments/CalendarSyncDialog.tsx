
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link as LinkIcon } from "lucide-react";

interface CalendarSyncDialogProps {
  onCalendlySync?: () => void;
}

const CalendarSyncDialog = ({ onCalendlySync }: CalendarSyncDialogProps) => {
  return (
    <Dialog>
      <DialogTitle>Connect with Calendly</DialogTitle>
      <DialogDescription>
        Link your Calendly account to automatically sync your dental appointments.
      </DialogDescription>
      <DialogContent>
        <div className="py-4">
          <div className="rounded-md bg-muted p-4 mb-4">
            <p className="text-sm">
              Connecting with Calendly allows you to:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Sync existing appointments</li>
              <li>Book new appointments with real-time availability</li>
              <li>Receive automatic reminders</li>
              <li>Easily reschedule when needed</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="calendlyUrl" className="text-sm font-medium">
                Your Calendly URL
              </label>
              <input
                id="calendlyUrl"
                placeholder="https://calendly.com/yourusername"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button className="w-full" onClick={onCalendlySync}>
              Connect Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarSyncDialog;
