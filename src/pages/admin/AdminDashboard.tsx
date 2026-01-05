
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllAppointments, useAllPatients } from '@/hooks/use-supabase-data';
import { useAuth } from '@/hooks/use-auth';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users,
  PlusCircle,
  Bell,
  XCircle,
  CheckCircle2,
  UserCog,
  SquareArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const { appointments, loading } = useAllAppointments();
  const { patients } = useAllPatients();
  const navigate = useNavigate();
  
  // If not admin, redirect to login
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);
  
  // Get patient name helper
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };
  
  // Calculate dashboard stats from real data
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appt => appt.date === today);
  const pendingAppointments = appointments.filter(appt => appt.status === 'pending_confirmation');
  
  const dashboardStats = {
    todayAppointments: todayAppointments.length,
    pendingAppointments: pendingAppointments.length,
    completedTreatments: appointments.filter(appt => appt.status === 'completed').length,
    newPatients: patients.length,
    upcomingFollowUps: 7,
    overdueBillings: 5,
    totalRevenue: 15650
  };
  
  // Get upcoming appointments (today and future)
  const upcomingAppointments = appointments
    .filter(appt => {
      const apptDate = new Date(appt.date);
      const now = new Date();
      apptDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      return apptDate >= now && appt.status !== 'cancelled' && appt.status !== 'completed';
    })
    .sort((a, b) => {
      // Sort by date, then time
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      
      // If same date, sort by time
      return a.time.localeCompare(b.time);
    })
    .slice(0, 5); // Get only next 5 appointments
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button>
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
              <div className="text-2xl font-bold">{dashboardStats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {todayAppointments.filter(a => a.status === 'completed').length} completed
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
                <span className="text-green-500">+{dashboardStats.newPatients}</span> registered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Actions
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-amber-500">{dashboardStats.overdueBillings}</span> overdue bills
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Appointments Section (5/7 width) */}
          <Card className="col-span-full lg:col-span-5">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/appointments">
                    View All <SquareArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="upcoming">
                <div className="px-4 md:px-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
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
                                {appointment.time}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {getPatientName(appointment.patient_id)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.type} • {appointment.dentist || 'To be assigned'}
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
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                            </Badge>
                            <Button variant="ghost" size="icon">
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
                                {appointment.time}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {getPatientName(appointment.patient_id)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.type} • {appointment.dentist || 'To be assigned'}
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
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                            </Badge>
                            <div className="flex">
                              <Button variant="ghost" size="icon">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
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
                
                <TabsContent value="pending" className="pt-3 px-4 md:px-6">
                  <div className="text-center py-6 text-muted-foreground">
                    No pending appointment requests
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Notifications/Alerts (2/7 width) */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </CardTitle>
                <Badge>{dashboardStats.upcomingFollowUps}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="text-sm font-medium">Follow-up Required</p>
                  <p className="text-xs text-muted-foreground">
                    Michael Brown's crown fitting is due next week
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                    <Button variant="ghost" size="sm" className="h-7">View</Button>
                  </div>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="text-sm font-medium">Payment Overdue</p>
                  <p className="text-xs text-muted-foreground">
                    Emily Johnson has an overdue invoice of $324
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                    <Button variant="ghost" size="sm" className="h-7">View</Button>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-sm font-medium">New Patient Registration</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah Wilson has registered as a new patient
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                    <Button variant="ghost" size="sm" className="h-7">View</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <Button variant="link" size="sm" className="text-xs">
                    View All Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 pb-4 last:pb-0 last:border-0 border-b">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {[
                        "Dr. Sarah Miller updated John Doe's treatment plan",
                        "Jenny Smith scheduled a new appointment for Emily Johnson",
                        "Dr. Robert Williams completed Michael Brown's procedure",
                        "Dr. Jennifer Lee uploaded X-Ray results for John Doe"
                      ][i-1]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {["30 minutes ago", "2 hours ago", "Yesterday, 3:45 PM", "2 days ago"][i-1]}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Appointment Completion Rate</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <span className="text-sm font-medium">97%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "97%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Schedule Utilization</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Collection Rate</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>
                
                <div className="pt-2 text-center">
                  <Button variant="outline" size="sm" className="mt-2">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Detailed Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
