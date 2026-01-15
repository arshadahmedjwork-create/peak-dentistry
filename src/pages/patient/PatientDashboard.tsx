import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CreditCard, User, Clock, MapPin, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PatientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) setProfile(profileData);

    // Fetch upcoming appointments
    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })
      .limit(3);

    if (appointmentsData) setAppointments(appointmentsData);

    // Fetch recent treatments
    const { data: treatmentsData } = await supabase
      .from('treatments')
      .select('*')
      .eq('patient_id', user.id)
      .order('treatment_date', { ascending: false })
      .limit(3);

    if (treatmentsData) setTreatments(treatmentsData);

    // Fetch recent invoices
    const { data: invoicesData } = await supabase
      .from('invoices')
      .select('*')
      .eq('patient_id', user.id)
      .order('invoice_date', { ascending: false })
      .limit(3);

    if (invoicesData) setInvoices(invoicesData);

    setLoading(false);
  };

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointment_date);
    setNewTime(appointment.appointment_time || '');
    setRescheduleDialogOpen(true);
  };

  const handleCancelClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment || !newDate || !newTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a new date and time.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('appointments')
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
        status: 'pending_confirmation'
      })
      .eq('id', selectedAppointment.id);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Appointment Rescheduled",
        description: "Your appointment has been rescheduled and is pending confirmation.",
      });
      setRescheduleDialogOpen(false);
      fetchDashboardData();
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', selectedAppointment.id);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      setCancelDialogOpen(false);
      fetchDashboardData();
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container-custom py-28">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  const upcomingAppointment = appointments[0];
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');

  return (
    <Layout>
      <div className="container-custom py-28 space-y-8">
        {/* Welcome Header */}
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 border-2">
            <AvatarImage src={profile?.profile_image_url} />
            <AvatarFallback>
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.first_name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your dental health journey
            </p>
          </div>
          <Button onClick={() => navigate('/patient/profile')}>
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Treatment History
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{treatments.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed treatments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invoices
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total billed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Next Appointment */}
          <Card>
            <CardHeader>
              <CardTitle>Next Appointment</CardTitle>
              <CardDescription>Your upcoming dental visit</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{upcomingAppointment.appointment_type}</span>
                        <Badge
                          variant={
                            upcomingAppointment.status === 'pending_confirmation' ? 'outline' :
                              upcomingAppointment.status === 'confirmed' || upcomingAppointment.status === 'scheduled' ? 'default' :
                                upcomingAppointment.status === 'completed' ? 'secondary' : 'outline'
                          }
                          className={
                            upcomingAppointment.status === 'pending_confirmation' ? 'border-amber-500 text-amber-600' : ''
                          }
                        >
                          {upcomingAppointment.status === 'pending_confirmation' ? 'Awaiting Confirmation' :
                            upcomingAppointment.status === 'scheduled' ? 'Scheduled' :
                              upcomingAppointment.status === 'confirmed' ? 'Confirmed' :
                                upcomingAppointment.status === 'completed' ? 'Completed' : upcomingAppointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(upcomingAppointment.appointment_date).toLocaleDateString()} at {upcomingAppointment.appointment_time}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Doctor:</span> {upcomingAppointment.dentist_name || 'To be assigned'}
                      </div>
                      {upcomingAppointment.notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {upcomingAppointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRescheduleClick(upcomingAppointment)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleCancelClick(upcomingAppointment)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Button onClick={() => navigate('/patient/book-appointment')}>
                    Schedule Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Treatments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Treatments</CardTitle>
              <CardDescription>Your treatment history</CardDescription>
            </CardHeader>
            <CardContent>
              {treatments.length > 0 ? (
                <div className="space-y-4">
                  {treatments.map((treatment) => (
                    <div key={treatment.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="rounded bg-primary/10 p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{treatment.procedure_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(treatment.treatment_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Dr. {treatment.dentist_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No treatment history
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto py-4 flex-col" onClick={() => navigate('/patient/book-appointment')}>
              <Calendar className="h-6 w-6 mb-2" />
              Book Appointment
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/contact')}>
              <MapPin className="h-6 w-6 mb-2" />
              Contact Us
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              View Billing
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">New Date</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-time">New Time</Label>
              <Input
                id="new-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4 bg-muted/50 rounded-lg p-4">
              <p className="font-medium">{selectedAppointment.appointment_type}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedAppointment.appointment_date).toLocaleDateString()} at {selectedAppointment.appointment_time}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Appointment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatientDashboard;
