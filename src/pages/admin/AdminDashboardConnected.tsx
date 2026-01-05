import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllAppointments, useAllPatients } from '@/hooks/use-supabase-data';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users,
  PlusCircle,
  Bell,
  XCircle,
  CheckCircle2,
  UserCog,
  SquareArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AppointmentFormModal from '@/components/admin/AppointmentFormModal';
import { useAdminList } from '@/hooks/use-admin-list';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminDashboardConnected = () => {
  const { appointments, loading: appointmentsLoading, refetch } = useAllAppointments();
  const { patients, loading: patientsLoading } = useAllPatients();
  const { admins, loading: adminsLoading } = useAdminList();
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [assignDoctorDialog, setAssignDoctorDialog] = useState<{
    open: boolean;
    appointmentId: string | null;
    currentDoctor: string;
  }>({ open: false, appointmentId: null, currentDoctor: '' });
  const [selectedDoctor, setSelectedDoctor] = useState('');
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    appt => appt.date === today && appt.status !== 'cancelled'
  );
  
  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(appt => 
      new Date(appt.date) >= new Date() &&
      appt.status !== 'cancelled'
    )
    .slice(0, 5);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAssignDoctor = (appointmentId: string, currentDoctor: string) => {
    setAssignDoctorDialog({ open: true, appointmentId, currentDoctor });
    setSelectedDoctor(currentDoctor);
  };

  const handleConfirmAssignDoctor = async () => {
    if (!assignDoctorDialog.appointmentId || !selectedDoctor) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ dentist_name: selectedDoctor })
        .eq('id', assignDoctorDialog.appointmentId);

      if (error) throw error;

      toast({
        title: "Doctor Assigned",
        description: "The doctor has been successfully assigned to this appointment.",
      });

      setAssignDoctorDialog({ open: false, appointmentId: null, currentDoctor: '' });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign doctor",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Confirmed",
        description: "The appointment has been confirmed successfully.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  if (appointmentsLoading || patientsLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsNewAppointmentOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayAppointments.filter(a => a.status === 'confirmed').length} confirmed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                Active patients
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Next 5 appointments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Actions
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'scheduled').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Appointments Section */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/appointments">
                  View All <SquareArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="upcoming">
              <div className="px-4 md:px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming" className="pt-3 px-4 md:px-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center bg-muted rounded-md p-3 min-w-20 text-center">
                            <span className="text-sm font-medium">
                              {formatDate(appointment.date)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {appointment.time?.slice(0, 5)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.type} • {appointment.dentist}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              appointment.status === 'confirmed' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleAssignDoctor(appointment.id, appointment.dentist)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming appointments scheduled
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="today" className="pt-3 px-4 md:px-6">
                {todayAppointments.length > 0 ? (
                  <div className="space-y-6">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center bg-muted rounded-md p-3 min-w-20 text-center">
                            <span className="text-sm font-medium">Today</span>
                            <span className="text-xs text-muted-foreground">
                              {appointment.time?.slice(0, 5)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.type} • {appointment.dentist}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(appointment.status === 'pending_confirmation' || appointment.status === 'scheduled') ? (
                            <div className="flex">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                                title="Confirm appointment"
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                title="Cancel appointment"
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                  : appointment.status === 'completed'
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AppointmentFormModal
          open={isNewAppointmentOpen}
          onOpenChange={setIsNewAppointmentOpen}
          onSuccess={refetch}
        />

        <Dialog open={assignDoctorDialog.open} onOpenChange={(open) => setAssignDoctorDialog({ ...assignDoctorDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Doctor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Doctor</label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.formatted_name}>
                        {admin.formatted_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDoctorDialog({ open: false, appointmentId: null, currentDoctor: '' })}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAssignDoctor} disabled={!selectedDoctor}>
                Assign Doctor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardConnected;
