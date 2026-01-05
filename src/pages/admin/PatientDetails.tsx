
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdminPortal } from '@/hooks/use-admin-portal';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileEdit,
  FilePlus,
  Mail,
  MapPin,
  Phone,
  Download,
  Upload,
  BadgeAlert,
  DollarSign,
  ScrollText,
  Tag,
  CheckCircle2,
  SquareCheck,
  Trash2,
  AlertCircle,
  User,
  CreditCard,
  HeartPulse,
  CalendarX
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatientById, getAppointmentsForPatient } = useAdminPortal();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const patient = getPatientById(id || "");
  
  useEffect(() => {
    if (!patient) {
      toast({
        title: "Patient Not Found",
        description: "The patient you are looking for does not exist or has been removed.",
      });
      navigate('/admin/patients');
    }
  }, [patient, navigate]);
  
  if (!patient) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Sort appointments by date (most recent first for past, soonest first for upcoming)
  const appointments = [...patient.appointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) >= new Date() && app.status !== 'cancelled'
  );
  
  const pastAppointments = appointments.filter(
    app => new Date(app.date) < new Date() || app.status === 'cancelled'
  ).reverse();
  
  // Sort treatments by date (most recent first)
  const treatments = [...patient.treatments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Sort billing by date (most recent first)
  const billing = [...patient.billing].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-1" asChild>
            <Link to="/admin/patients">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Patients</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Patient
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Edit Demographics
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HeartPulse className="mr-2 h-4 w-4" />
                  Edit Medical History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Edit Billing Info
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Card - 1/3 width */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage 
                      src={patient.profile.profileImageUrl} 
                      alt={`${patient.profile.firstName} ${patient.profile.lastName}`} 
                    />
                    <AvatarFallback className="text-2xl">
                      {patient.profile.firstName[0]}{patient.profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">
                    {patient.profile.firstName} {patient.profile.lastName}
                  </CardTitle>
                  <CardDescription className="text-center flex flex-wrap justify-center gap-1 mt-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                      Active Patient
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Patient #{patient.id}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <Separator />
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm break-all">{patient.profile.email}</span>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.profile.phone}</span>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.profile.address}</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Personal Details</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">{formatDate(patient.profile.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm">{calculateAge(patient.profile.dateOfBirth)} years</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Emergency Contact</p>
                      <p className="text-sm">{patient.profile.emergencyContact}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Insurance Information</h3>
                  <Separator />
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="text-sm">{patient.profile.insuranceProvider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Policy Number</p>
                      <p className="text-sm">{patient.profile.insuranceNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Patient Record
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <BadgeAlert className="mr-2 h-4 w-4" />
                  Add Alert or Flag
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content Area - 2/3 width */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Quick Overview Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-2xl font-bold">
                      ${billing.filter(b => b.status === 'sent' || b.status === 'overdue').reduce((sum, bill) => sum + bill.total, 0).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <CalendarX className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="text-xl font-bold">
                      {pastAppointments.length > 0 
                        ? new Date(pastAppointments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : "Never"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <ScrollText className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">{patient.documents.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Tag className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-md font-bold">
                      <Badge className="mt-1" variant="outline">Active</Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs for different sections */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start rounded-none px-4 pt-4 border-b">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="treatments">Treatments</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-4 md:p-6 space-y-6">
                    {/* Upcoming Appointment */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Upcoming Appointment</h3>
                      {upcomingAppointments.length > 0 ? (
                        <Card>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{upcomingAppointments[0].type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(upcomingAppointments[0].date)} • {upcomingAppointments[0].time}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {upcomingAppointments[0].dentist}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button size="sm">Confirm</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-muted p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-medium">No upcoming appointments</h4>
                                <p className="text-sm text-muted-foreground">
                                  This patient has no scheduled appointments
                                </p>
                              </div>
                            </div>
                            <Button>Schedule</Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                      <Card>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {treatments.length > 0 && (
                              <div className="p-4 flex items-start gap-4">
                                <div className="bg-blue-500/10 p-2 rounded">
                                  <HeartPulse className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Treatment Completed</h4>
                                  <p className="text-sm">{treatments[0].procedure}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(treatments[0].date)} • {treatments[0].dentist}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {billing.length > 0 && (
                              <div className="p-4 flex items-start gap-4">
                                <div className="bg-green-500/10 p-2 rounded">
                                  <DollarSign className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Invoice #{billing[0].invoiceNumber}
                                    <Badge className="ml-2" variant={billing[0].status === 'paid' ? 'outline' : 'default'}>
                                      {billing[0].status.charAt(0).toUpperCase() + billing[0].status.slice(1)}
                                    </Badge>
                                  </h4>
                                  <p className="text-sm">${billing[0].total.toFixed(2)}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(billing[0].date)}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {patient.documents.length > 0 && (
                              <div className="p-4 flex items-start gap-4">
                                <div className="bg-purple-500/10 p-2 rounded">
                                  <Upload className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Document Uploaded</h4>
                                  <p className="text-sm">{patient.documents[0].title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(patient.documents[0].uploadedAt).toLocaleDateString()} • {patient.documents[0].uploadedBy}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            <div className="p-4 flex items-start gap-4">
                              <div className="bg-amber-500/10 p-2 rounded">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                              </div>
                              <div>
                                <h4 className="font-medium">Patient Account Created</h4>
                                <p className="text-sm">New patient record was created</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(patient.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Appointment History</h3>
                      <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule New
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  No appointments found for this patient
                                </TableCell>
                              </TableRow>
                            ) : (
                              appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell>
                                    <div className="font-medium">{new Date(appointment.date).toLocaleDateString()}</div>
                                    <div className="text-sm text-muted-foreground">{appointment.time}</div>
                                  </TableCell>
                                  <TableCell>{appointment.type}</TableCell>
                                  <TableCell>{appointment.dentist}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        appointment.status === 'completed' 
                                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                          : appointment.status === 'cancelled' 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : appointment.status === 'confirmed'
                                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                      }
                                    >
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">View</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Appointment Details</DialogTitle>
                                            <DialogDescription>
                                              {formatDate(appointment.date)} • {appointment.time}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-4 gap-4">
                                              <div className="space-y-1 col-span-2">
                                                <p className="text-sm font-medium">Type</p>
                                                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                              </div>
                                              <div className="space-y-1 col-span-2">
                                                <p className="text-sm font-medium">Provider</p>
                                                <p className="text-sm text-muted-foreground">{appointment.dentist}</p>
                                              </div>
                                              <div className="space-y-1 col-span-4">
                                                <p className="text-sm font-medium">Status</p>
                                                <p className="text-sm">
                                                  <Badge
                                                    variant="outline"
                                                    className={
                                                      appointment.status === 'completed' 
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                        : appointment.status === 'cancelled' 
                                                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                          : appointment.status === 'confirmed'
                                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }
                                                  >
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                  </Badge>
                                                </p>
                                              </div>
                                              <div className="space-y-1 col-span-4">
                                                <p className="text-sm font-medium">Notes</p>
                                                <p className="text-sm text-muted-foreground">{appointment.notes || "No notes recorded"}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button variant="outline">Edit</Button>
                                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                              <Button>Mark Complete</Button>
                                            )}
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                        <>
                                          <Button variant="ghost" size="sm">Edit</Button>
                                          <Button variant="ghost" size="sm" className="text-red-500">Cancel</Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Treatments Tab */}
                  <TabsContent value="treatments" className="p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Treatment History</h3>
                      <Button>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Add Treatment
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Procedure</TableHead>
                              <TableHead>Dentist</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {treatments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  No treatments found for this patient
                                </TableCell>
                              </TableRow>
                            ) : (
                              treatments.map((treatment) => (
                                <TableRow key={treatment.id}>
                                  <TableCell>
                                    <div className="font-medium">{new Date(treatment.date).toLocaleDateString()}</div>
                                  </TableCell>
                                  <TableCell>{treatment.procedure}</TableCell>
                                  <TableCell>{treatment.dentist}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        treatment.status === 'completed' 
                                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                          : treatment.status === 'in-progress' 
                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                      }
                                    >
                                      {treatment.status === 'in-progress' ? 'In Progress' : treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">View</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Treatment Details</DialogTitle>
                                            <DialogDescription>
                                              {formatDate(treatment.date)}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-4 gap-4">
                                              <div className="space-y-1 col-span-2">
                                                <p className="text-sm font-medium">Procedure</p>
                                                <p className="text-sm text-muted-foreground">{treatment.procedure}</p>
                                              </div>
                                              <div className="space-y-1 col-span-2">
                                                <p className="text-sm font-medium">Dentist</p>
                                                <p className="text-sm text-muted-foreground">{treatment.dentist}</p>
                                              </div>
                                              <div className="space-y-1 col-span-4">
                                                <p className="text-sm font-medium">Status</p>
                                                <p className="text-sm">
                                                  <Badge
                                                    variant="outline"
                                                    className={
                                                      treatment.status === 'completed' 
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                        : treatment.status === 'in-progress' 
                                                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }
                                                  >
                                                    {treatment.status === 'in-progress' ? 'In Progress' : treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
                                                  </Badge>
                                                </p>
                                              </div>
                                              <div className="space-y-1 col-span-4">
                                                <p className="text-sm font-medium">Details</p>
                                                <p className="text-sm text-muted-foreground">{treatment.details}</p>
                                              </div>
                                              {treatment.followUp && (
                                                <div className="space-y-1 col-span-4">
                                                  <p className="text-sm font-medium">Follow-up</p>
                                                  <p className="text-sm text-muted-foreground">{formatDate(treatment.followUp)}</p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button variant="outline">Edit</Button>
                                            {treatment.status !== 'completed' && (
                                              <Button>Mark Complete</Button>
                                            )}
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <Button variant="ghost" size="sm">Edit</Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Documents Tab */}
                  <TabsContent value="documents" className="p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Patient Documents</h3>
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Document</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Added By</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patient.documents.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  No documents found for this patient
                                </TableCell>
                              </TableRow>
                            ) : (
                              patient.documents.map((document) => (
                                <TableRow key={document.id}>
                                  <TableCell>
                                    <div className="font-medium">{document.title}</div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{document.uploadedBy}</TableCell>
                                  <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="sm">View</Button>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Billing Tab */}
                  <TabsContent value="billing" className="p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <Button>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice #</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {billing.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  No billing records found for this patient
                                </TableCell>
                              </TableRow>
                            ) : (
                              billing.map((bill) => (
                                <TableRow key={bill.id}>
                                  <TableCell>
                                    <div className="font-medium">{bill.invoiceNumber}</div>
                                  </TableCell>
                                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                                  <TableCell>${bill.total.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        bill.status === 'paid' 
                                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                          : bill.status === 'overdue' 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : bill.status === 'sent'
                                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                      }
                                    >
                                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">View</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                          <DialogHeader>
                                            <DialogTitle>Invoice #{bill.invoiceNumber}</DialogTitle>
                                            <DialogDescription>
                                              {formatDate(bill.date)}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                              <div className="flex justify-between mb-4">
                                                <div>
                                                  <h3 className="text-lg font-bold">PEAK DENTISTRY</h3>
                                                  <p className="text-sm text-muted-foreground">
                                                    123 Dental Street, Suite 100<br />
                                                    San Francisco, CA 94103
                                                  </p>
                                                </div>
                                                <div className="text-right">
                                                  <p className="text-sm font-medium">Invoice To:</p>
                                                  <p className="text-sm">
                                                    {patient.profile.firstName} {patient.profile.lastName}<br />
                                                    {patient.profile.email}<br />
                                                    {patient.profile.address.split(',')[0]}<br />
                                                  </p>
                                                </div>
                                              </div>
                                              
                                              <Separator />
                                              
                                              <div className="space-y-4 mt-4">
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Item</TableHead>
                                                      <TableHead className="text-center">Qty</TableHead>
                                                      <TableHead className="text-right">Unit Price</TableHead>
                                                      <TableHead className="text-right">Total</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {bill.items.map((item) => (
                                                      <TableRow key={item.id}>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                                
                                                <div className="space-y-2 text-right">
                                                  <div className="flex justify-end">
                                                    <div className="w-60 space-y-1">
                                                      <div className="flex justify-between text-sm">
                                                        <span>Subtotal:</span>
                                                        <span>${bill.subtotal.toFixed(2)}</span>
                                                      </div>
                                                      <div className="flex justify-between text-sm">
                                                        <span>Tax:</span>
                                                        <span>${bill.tax.toFixed(2)}</span>
                                                      </div>
                                                      {bill.discount && (
                                                        <div className="flex justify-between text-sm text-green-600">
                                                          <span>Discount:</span>
                                                          <span>-${bill.discount.toFixed(2)}</span>
                                                        </div>
                                                      )}
                                                      <Separator />
                                                      <div className="flex justify-between font-medium">
                                                        <span>Total:</span>
                                                        <span>${bill.total.toFixed(2)}</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <DialogFooter className="gap-2">
                                            <Button variant="outline">
                                              <Download className="mr-2 h-4 w-4" />
                                              Download
                                            </Button>
                                            {bill.status !== 'paid' && (
                                              <Button>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Mark as Paid
                                              </Button>
                                            )}
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      {bill.status !== 'paid' && (
                                        <Button variant="ghost" size="sm" className="text-green-500">
                                          <SquareCheck className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Notes Tab */}
                  <TabsContent value="notes" className="p-4 md:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Clinical Notes</h3>
                      <Button>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {patient.notes.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                              No notes found for this patient
                            </div>
                          ) : (
                            patient.notes.map((note) => (
                              <div key={note.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={note.isPrivate ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}>
                                      {note.isPrivate ? 'Private' : 'Standard'}
                                    </Badge>
                                    <span className="text-sm font-medium">{note.author}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-sm">{note.content}</p>
                                <div className="flex justify-end mt-2">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientDetails;
