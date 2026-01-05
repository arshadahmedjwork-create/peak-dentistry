import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { useAdminList } from '@/hooks/use-admin-list';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface AppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  preselectedPatient?: Patient;
}

const AppointmentFormModal = ({ open, onOpenChange, onSuccess, preselectedPatient }: AppointmentFormModalProps) => {
  const { admins } = useAdminList();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [formData, setFormData] = useState({
    appointment_type: '',
    dentist_name: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });

  const searchPatients = async (query: string) => {
    if (query.length < 2) {
      setPatients([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchPatients(value);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchOpen(false);
    setSearchQuery('');
    setPatients([]); // Clear patients list after selection
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !formData.appointment_type || !formData.dentist_name || 
        !formData.appointment_date || !formData.appointment_time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: selectedPatient.id,
          appointment_type: formData.appointment_type,
          dentist_name: formData.dentist_name,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          notes: formData.notes,
          status: 'scheduled'
        }]);

      if (error) throw error;

      toast({
        title: "Appointment Created",
        description: "The appointment has been scheduled successfully."
      });

      // Reset form
      setFormData({
        appointment_type: '',
        dentist_name: '',
        appointment_date: '',
        appointment_time: '',
        notes: '',
      });
      setSelectedPatient(null);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!preselectedPatient && (
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedPatient 
                      ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                      : "Search patient..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search by name or email..."
                      onValueChange={handleSearchChange}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchQuery.length < 2 
                          ? "Type at least 2 characters to search..." 
                          : "No patient found."}
                      </CommandEmpty>
                      {patients.length > 0 && (
                        <CommandGroup>
                          {patients.map((patient) => (
                            <CommandItem
                              key={patient.id}
                              value={patient.id}
                              onSelect={() => handlePatientSelect(patient)}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {patient.first_name} {patient.last_name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {patient.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {selectedPatient && preselectedPatient && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">
                {selectedPatient.first_name} {selectedPatient.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_type">Appointment Type *</Label>
              <Select
                value={formData.appointment_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Checkup">Checkup</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Filling">Filling</SelectItem>
                  <SelectItem value="Root Canal">Root Canal</SelectItem>
                  <SelectItem value="Extraction">Extraction</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentist_name">Doctor *</Label>
              <Select
                value={formData.dentist_name}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dentist_name: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {admins.map(admin => (
                    <SelectItem key={admin.id} value={admin.formatted_name}>
                      {admin.formatted_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date *</Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_time">Time *</Label>
              <Input
                id="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormModal;
