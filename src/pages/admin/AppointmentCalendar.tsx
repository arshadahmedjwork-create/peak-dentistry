import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAllAppointments, useAllPatients } from '@/hooks/use-supabase-data';
import { useAdminList } from '@/hooks/use-admin-list';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ListFilter,
  CalendarIcon,
  Users,
  User
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const AppointmentCalendar = () => {
  const { appointments: allAppointments, loading: appointmentsLoading, refetch: refetchAppointments } = useAllAppointments();
  const { patients: allPatients } = useAllPatients();
  const { admins } = useAdminList();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [calendarView, setCalendarView] = useState<'schedule' | 'calendar' | 'pending'>('schedule');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isAssignDoctorOpen, setIsAssignDoctorOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');
  
  // Set up real-time subscription to appointments table
  useEffect(() => {
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          refetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchAppointments]);
  
  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    appointment_type: '',
    appointment_date: '',
    appointment_time: '',
    dentist_name: '',
    notes: ''
  });

  // Get appointments for the selected date (now includes all statuses)
  const getAppointmentsForDate = (date: Date) => {
    // Format date as YYYY-MM-DD in local timezone (not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    let filtered = allAppointments.filter(appt => appt.date === dateString);
    
    if (selectedProvider !== 'all') {
      filtered = filtered.filter(appt => appt.dentist === selectedProvider);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(appt => {
        const patient = allPatients.find(p => p.id === appt.patient_id);
        const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
        return patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               appt.type.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered;
  };
  
  const appointmentsForSelectedDate = selectedDate ? getAppointmentsForDate(selectedDate) : [];
  
  // Time slots for the day view (9 AM to 5 PM, 30-minute intervals)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour % 12 || 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const timeString = `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${amPm}`;
      timeSlots.push(timeString);
    }
  }
  
  const getAppointmentsForTimeSlot = (timeSlot: string) => {
    if (!selectedDate) return [];
    return appointmentsForSelectedDate.filter(appt => {
      if (!appt.time) return false;
      
      // Parse the time slot to get the start time in 24-hour format
      const [slotTime, slotModifier] = timeSlot.split(' ');
      const [slotHourStr, slotMinuteStr] = slotTime.split(':');
      let slotHour = parseInt(slotHourStr);
      const slotMinute = parseInt(slotMinuteStr);
      
      // Convert slot time to 24-hour format
      if (slotModifier === 'PM' && slotHour !== 12) {
        slotHour += 12;
      } else if (slotModifier === 'AM' && slotHour === 12) {
        slotHour = 0;
      }
      
      // Parse appointment time
      let appointmentTime = appt.time;
      let appointmentHour: number;
      let appointmentMinute: number;
      
      // Handle both database format (HH:MM:SS) and display format (HH:MM AM/PM)
      if (appointmentTime.includes('AM') || appointmentTime.includes('PM')) {
        const [time, modifier] = appointmentTime.split(' ');
        const [hourStr, minuteStr] = time.split(':');
        appointmentHour = parseInt(hourStr);
        appointmentMinute = parseInt(minuteStr);
        
        // Convert to 24-hour format
        if (modifier === 'PM' && appointmentHour !== 12) {
          appointmentHour += 12;
        } else if (modifier === 'AM' && appointmentHour === 12) {
          appointmentHour = 0;
        }
      } else {
        // Database format (HH:MM:SS or HH:MM)
        const timeParts = appointmentTime.split(':');
        appointmentHour = parseInt(timeParts[0]);
        appointmentMinute = parseInt(timeParts[1]);
      }
      
      // Check if appointment falls within this 30-minute slot
      // Slot range: slotHour:slotMinute to slotHour:slotMinute+29
      const appointmentTotalMinutes = appointmentHour * 60 + appointmentMinute;
      const slotStartMinutes = slotHour * 60 + slotMinute;
      const slotEndMinutes = slotStartMinutes + 29; // 30-minute slot (0-29 minutes)
      
      return appointmentTotalMinutes >= slotStartMinutes && appointmentTotalMinutes <= slotEndMinutes;
    });
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Navigation for date selection
  const navigateDate = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };
  
  const getTodaysAppointments = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    return allAppointments.filter(appt => appt.date === todayString);
  };
  
  const handleAppointmentAction = async (appointmentId: string, action: 'approve' | 'confirm' | 'cancel' | 'complete') => {
    const statusMap = {
      approve: 'scheduled' as const,
      confirm: 'confirmed' as const,
      cancel: 'cancelled' as const,
      complete: 'completed' as const
    };
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: statusMap[action] })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast({
        title: action === 'approve' 
          ? "Appointment Approved" 
          : action === 'confirm' 
            ? "Appointment Confirmed" 
            : action === 'cancel' 
              ? "Appointment Cancelled" 
              : "Appointment Completed",
        description: `The appointment has been ${
          action === 'approve' ? 'approved and scheduled' : 
          action === 'confirm' ? 'confirmed' : 
          action === 'cancel' ? 'cancelled' : 
          'marked as completed'
        }.`,
      });
      
      refetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const getPatientById = (patientId: string) => {
    return allPatients.find(p => p.id === patientId);
  };
  
  // Function to determine if a date has appointments
  const hasAppointments = (date: Date) => {
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return allAppointments.some(appt => appt.date === dateString);
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctorName || !selectedAppointmentId) {
      toast({
        title: "Missing Selection",
        description: "Please select a doctor",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ dentist_name: selectedDoctorName })
        .eq('id', selectedAppointmentId);

      if (error) throw error;

      toast({
        title: "Doctor Assigned",
        description: "The doctor has been successfully assigned to this appointment.",
      });

      setIsAssignDoctorOpen(false);
      setSelectedAppointmentId('');
      setSelectedDoctorName('');
      refetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openAssignDoctorDialog = (appointmentId: string, currentDoctor: string) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedDoctorName(currentDoctor || '');
    setIsAssignDoctorOpen(true);
  };
  
  const handleCreateAppointment = async () => {
    if (!newAppointment.patient_id || !newAppointment.appointment_type || 
        !newAppointment.appointment_date || !newAppointment.appointment_time || 
        !newAppointment.dentist_name) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Convert time from "HH:MM AM/PM" to "HH:MM:SS" format for database
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    };
    
    try {
      const appointmentData = {
        ...newAppointment,
        appointment_time: convertTo24Hour(newAppointment.appointment_time)
      };
      
      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);
      
      if (error) throw error;
      
      toast({
        title: "Appointment Scheduled",
        description: "The appointment has been scheduled successfully.",
      });
      
      setIsNewAppointmentOpen(false);
      setNewAppointment({
        patient_id: '',
        appointment_type: '',
        appointment_date: '',
        appointment_time: '',
        dentist_name: '',
        notes: ''
      });
      refetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Get unique providers for filtering - filter out empty/null values
  const providers = ['all', ...new Set(
    allAppointments
      .map(appt => appt.dentist)
      .filter(name => name && name.trim())
  )];
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage and schedule patient appointments
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                  <DialogDescription>
                    Create a new appointment for a patient.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Patient</Label>
                    <Select value={newAppointment.patient_id} onValueChange={(value) => setNewAppointment({...newAppointment, patient_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPatients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <Select value={newAppointment.appointment_type} onValueChange={(value) => setNewAppointment({...newAppointment, appointment_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular Checkup">Regular Checkup</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Root Canal">Root Canal</SelectItem>
                        <SelectItem value="Cavity Filling">Cavity Filling</SelectItem>
                        <SelectItem value="Tooth Extraction">Tooth Extraction</SelectItem>
                        <SelectItem value="X-Ray">X-Ray</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={newAppointment.appointment_date}
                        onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Select value={newAppointment.appointment_time} onValueChange={(value) => setNewAppointment({...newAppointment, appointment_time: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select value={newAppointment.dentist_name} onValueChange={(value) => setNewAppointment({...newAppointment, dentist_name: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dentist" />
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
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea 
                      placeholder="Add notes about this appointment"
                      value={newAppointment.notes || ''}
                      onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateAppointment}>Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Assign Doctor Dialog */}
            <Dialog open={isAssignDoctorOpen} onOpenChange={setIsAssignDoctorOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Doctor</DialogTitle>
                  <DialogDescription>
                    Select a doctor to assign to this appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Doctor</Label>
                    <Select value={selectedDoctorName} onValueChange={setSelectedDoctorName}>
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
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAssignDoctorOpen(false)}>Cancel</Button>
                  <Button onClick={handleAssignDoctor}>Assign Doctor</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Tabs defaultValue="schedule" className="w-full" value={calendarView} onValueChange={(v) => setCalendarView(v as 'schedule' | 'calendar' | 'pending')}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="schedule">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <Clock className="mr-2 h-4 w-4" />
                  Awaiting
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      {selectedProvider === 'all' ? 'All Providers' : selectedProvider}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50">
                    <DropdownMenuLabel>Filter by Provider</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {providers.map((provider, index) => (
                      <DropdownMenuItem 
                        key={`provider-${provider}-${index}`} 
                        onClick={() => setSelectedProvider(provider)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {provider === 'all' ? 'All Providers' : provider}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    className="pl-8 max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-lg font-medium">
                        {formatDate(selectedDate)}
                      </div>
                      
                      <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedDate(new Date())}
                        className="ml-2"
                      >
                        Today
                      </Button>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2">
                      <Button 
                        variant={viewMode === 'day' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('day')}
                      >
                        Day
                      </Button>
                      <Button 
                        variant={viewMode === 'week' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('week')}
                      >
                        Week
                      </Button>
                      <Button 
                        variant={viewMode === 'month' ? 'secondary' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('month')}
                      >
                        Month
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {viewMode === 'day' && (
                    <div className="space-y-4">
                      {timeSlots.map((timeSlot, index) => {
                        const appointmentsAtTime = getAppointmentsForTimeSlot(timeSlot);
                        return (
                          <div key={timeSlot} className={`grid grid-cols-[100px_1fr] gap-4 ${index % 2 === 0 ? 'bg-muted/20' : ''} p-2 rounded-md`}>
                            <div className="font-medium text-sm">{timeSlot}</div>
                            <div>
                              {appointmentsAtTime.length > 0 ? (
                                <div className="space-y-2">
                                  {appointmentsAtTime.map((appointment) => {
                                    const patient = getPatientById(appointment.patient_id);
                                    return (
                                      <Card key={appointment.id} className={`border-l-4 ${
                                        appointment.status === 'pending_confirmation'
                                          ? 'border-l-amber-500'
                                          : appointment.status === 'confirmed' || appointment.status === 'scheduled'
                                            ? 'border-l-green-500' 
                                            : appointment.status === 'cancelled' 
                                              ? 'border-l-red-500' 
                                              : appointment.status === 'completed' 
                                                ? 'border-l-blue-500' 
                                                : 'border-l-gray-500'
                                      }`}>
                                        <CardContent className="p-3">
                                          <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage src={patient?.profile_image_url || ''} />
                                                <AvatarFallback>
                                                  {patient?.first_name?.[0]}{patient?.last_name?.[0]}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                 <h4 className="font-medium text-sm">
                                                  {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                  {appointment.type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  {appointment.dentist}
                                                </p>
                                                {appointment.notes && (
                                                  <p className="text-xs text-muted-foreground mt-1">
                                                    Note: {appointment.notes}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex gap-1">
                                              <Badge variant={
                                                appointment.status === 'pending_confirmation' ? 'outline' :
                                                appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'default' :
                                                appointment.status === 'cancelled' ? 'destructive' :
                                                appointment.status === 'completed' ? 'secondary' : 'outline'
                                              } className={
                                                appointment.status === 'pending_confirmation' ? 'border-amber-500 text-amber-600' : ''
                                              }>
                                                {appointment.status === 'pending_confirmation' ? 'Awaiting Confirmation' : appointment.status}
                                              </Badge>
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <ListFilter className="h-3 w-3" />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                 <DropdownMenuContent align="end">
                                                  <DropdownMenuItem onClick={() => openAssignDoctorDialog(appointment.id, appointment.dentist)}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Assign Doctor
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem onClick={() => handleAppointmentAction(appointment.id, 'approve')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Approve & Schedule
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleAppointmentAction(appointment.id, 'confirm')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Confirm
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleAppointmentAction(appointment.id, 'complete')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Complete
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleAppointmentAction(appointment.id, 'cancel')}>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Cancel
                                                  </DropdownMenuItem>
                                                </DropdownMenuContent>
                                              </DropdownMenu>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">No appointments</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments Awaiting Confirmation</CardTitle>
                  <CardDescription>
                    Review and approve patient appointment requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {allAppointments.filter(appt => appt.status === 'pending_confirmation').length > 0 ? (
                    <div className="space-y-4">
                      {allAppointments
                        .filter(appt => appt.status === 'pending_confirmation')
                        .map((appointment) => {
                          const patient = getPatientById(appointment.patient_id);
                          return (
                            <Card key={appointment.id} className="border-l-4 border-l-amber-500">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex gap-4">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage src={patient?.profile_image_url || ''} />
                                      <AvatarFallback>
                                        {patient?.first_name?.[0]}{patient?.last_name?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                                      </h4>
                                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <CalendarDays className="h-4 w-4" />
                                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                          })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          {appointment.time}
                                        </div>
                                      </div>
                                      <p className="text-sm mt-1 font-medium">{appointment.type}</p>
                                      {patient?.email && (
                                        <p className="text-xs text-muted-foreground mt-1">{patient.email}</p>
                                      )}
                                      {patient?.phone && (
                                        <p className="text-xs text-muted-foreground">{patient.phone}</p>
                                      )}
                                      {appointment.notes && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Note: {appointment.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No Pending Appointments</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        All appointment requests have been reviewed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md w-full"
                      modifiers={{
                        hasAppointments: (date) => hasAppointments(date)
                      }}
                      modifiersStyles={{
                        hasAppointments: {
                          backgroundColor: 'hsl(var(--primary) / 0.1)',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {formatDate(selectedDate)}
                    </CardTitle>
                    <CardDescription>
                      {appointmentsForSelectedDate.length} appointment{appointmentsForSelectedDate.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appointmentsForSelectedDate.length > 0 ? (
                        appointmentsForSelectedDate.map((appointment) => {
                          const patient = getPatientById(appointment.patient_id);
                          return (
                            <Card key={appointment.id} className="border-l-4 border-l-primary">
                              <CardContent className="p-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">{appointment.time}</span>
                                  </div>
                                  <p className="text-sm font-medium">
                                    {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {appointment.type}
                                  </p>
                                  <Badge variant={
                                    appointment.status === 'pending_confirmation' ? 'outline' :
                                    appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'default' :
                                    appointment.status === 'cancelled' ? 'destructive' :
                                    appointment.status === 'completed' ? 'secondary' : 'outline'
                                  } className={
                                    appointment.status === 'pending_confirmation' ? 'border-amber-500 text-amber-600' : ''
                                  }>
                                    {appointment.status === 'pending_confirmation' ? 'Awaiting Confirmation' : appointment.status}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No appointments scheduled
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Today's Appointments Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              {getTodaysAppointments().length} appointment{getTodaysAppointments().length !== 1 ? 's' : ''} scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getTodaysAppointments().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTodaysAppointments().map((appointment) => {
                  const patient = getPatientById(appointment.patient_id);
                  return (
                    <Card key={appointment.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={patient?.profile_image_url || ''} />
                              <AvatarFallback>
                                {patient?.first_name?.[0]}{patient?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-sm">
                                {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {appointment.time}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {appointment.type}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            appointment.status === 'pending_confirmation' ? 'outline' :
                            appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'default' :
                            appointment.status === 'cancelled' ? 'destructive' :
                            appointment.status === 'completed' ? 'secondary' : 'outline'
                          } className={
                            appointment.status === 'pending_confirmation' ? 'border-amber-500 text-amber-600' : ''
                          }>
                            {appointment.status === 'pending_confirmation' ? 'Awaiting Confirmation' : appointment.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No appointments scheduled for today
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AppointmentCalendar;
