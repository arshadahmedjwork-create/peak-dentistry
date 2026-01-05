import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkeletonCard } from '@/components/ui/skeleton-wrapper';
import STLUploadDialog from '@/components/admin/STLUploadDialog';
import { TreatmentSelector } from '@/components/admin/TreatmentSelector';
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  CreditCard,
  FileEdit,
  FilePlus,
  Download,
  DollarSign,
  ScrollText,
  Tag,
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

interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  insurance_provider?: string;
  insurance_number?: string;
  emergency_contact?: string;
  profile_image_url?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  dentist_name: string;
  status: string;
  notes?: string;
}

interface Treatment {
  id: string;
  treatment_date: string;
  procedure_name: string;
  dentist_name: string;
  tooth_number?: string;
  details?: string;
  procedure_id?: string;
  category_name?: string;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  upload_date: string;
  file_size_bytes?: number;
  file_url: string;
}

interface Invoice {
  id: string;
  invoice_date: string;
  invoice_number: string;
  description: string;
  total_amount: number;
  insurance_covered: number;
  amount_paid: number;
  status: string;
}

const PatientDetailsConnected = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingSTL, setIsUploadingSTL] = useState(false);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  
  const [newTreatment, setNewTreatment] = useState({
    procedure_name: '',
    dentist_name: '',
    tooth_number: '',
    details: '',
    treatment_date: new Date().toISOString().split('T')[0],
    procedure_id: undefined as string | undefined,
    category_name: undefined as string | undefined
  });
  
  const [newAppointment, setNewAppointment] = useState({
    appointment_type: '',
    dentist_name: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const [editedProfile, setEditedProfile] = useState<PatientProfile | null>(null);
  
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    service_type: '',
    description: '',
    total_amount: '',
    insurance_covered: '0',
    amount_paid: '0',
    status: 'pending' as 'pending' | 'paid' | 'overdue' | 'cancelled'
  });

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', id)
        .order('appointment_date', { ascending: false });
      setAppointments(appointmentsData || []);

      // Fetch treatments
      const { data: treatmentsData } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', id)
        .order('treatment_date', { ascending: false });
      setTreatments(treatmentsData || []);

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('documents')
        .select('*')
        .eq('patient_id', id)
        .order('upload_date', { ascending: false });
      setDocuments(documentsData || []);

      // Fetch invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('patient_id', id)
        .order('invoice_date', { ascending: false });
      setInvoices(invoicesData || []);

    } catch (error: any) {
      toast({
        title: "Error Loading Patient",
        description: error.message,
        variant: "destructive"
      });
      navigate('/admin/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = async () => {
    if (!id || !newTreatment.procedure_name || !newTreatment.dentist_name) {
      toast({
        title: "Missing Fields",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('treatments')
        .insert([{
          patient_id: id,
          procedure_name: newTreatment.procedure_name,
          dentist_name: newTreatment.dentist_name,
          tooth_number: newTreatment.tooth_number,
          details: newTreatment.details,
          treatment_date: newTreatment.treatment_date,
          procedure_id: newTreatment.procedure_id || null
        }]);

      if (error) throw error;

      toast({
        title: "Treatment Added",
        description: "Treatment has been added successfully."
      });

      setIsAddingTreatment(false);
      setNewTreatment({
        procedure_name: '',
        dentist_name: '',
        tooth_number: '',
        details: '',
        treatment_date: new Date().toISOString().split('T')[0],
        procedure_id: undefined,
        category_name: undefined
      });
      fetchPatientData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddAppointment = async () => {
    if (!id || !newAppointment.appointment_type || !newAppointment.dentist_name || 
        !newAppointment.appointment_date || !newAppointment.appointment_time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: id,
          ...newAppointment
        }]);

      if (error) throw error;

      toast({
        title: "Appointment Scheduled",
        description: "Appointment has been scheduled successfully."
      });

      setIsAddingAppointment(false);
      setNewAppointment({
        appointment_type: '',
        dentist_name: '',
        appointment_date: '',
        appointment_time: '',
        notes: ''
      });
      fetchPatientData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditProfile = () => {
    setEditedProfile(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile || !id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone: editedProfile.phone,
          address: editedProfile.address,
          date_of_birth: editedProfile.date_of_birth,
          emergency_contact: editedProfile.emergency_contact,
          insurance_provider: editedProfile.insurance_provider,
          insurance_number: editedProfile.insurance_number
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Patient profile has been updated successfully."
      });

      setIsEditingProfile(false);
      fetchPatientData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddInvoice = async () => {
    if (!id || !newInvoice.service_type || !newInvoice.total_amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const invoiceNumber = newInvoice.invoice_number || `INV-${Date.now().toString().slice(-6)}`;

    try {
      const { error } = await supabase
        .from('invoices')
        .insert([{
          patient_id: id,
          invoice_number: invoiceNumber,
          invoice_date: newInvoice.invoice_date,
          due_date: newInvoice.due_date || null,
          service_type: newInvoice.service_type,
          description: newInvoice.description,
          total_amount: Number(newInvoice.total_amount),
          insurance_covered: Number(newInvoice.insurance_covered),
          amount_paid: Number(newInvoice.amount_paid),
          status: newInvoice.status
        }]);

      if (error) throw error;

      toast({
        title: "Invoice Created",
        description: "Invoice has been added successfully."
      });

      setIsAddingInvoice(false);
      setNewInvoice({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        service_type: '',
        description: '',
        total_amount: '',
        insurance_covered: '0',
        amount_paid: '0',
        status: 'pending'
      });
      fetchPatientData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <AdminLayout>
        <SkeletonCard numberOfLines={20} />
      </AdminLayout>
    );
  }

  if (!profile) {
    return null;
  }

  const upcomingAppointments = appointments.filter(
    app => new Date(app.appointment_date) >= new Date() && app.status !== 'cancelled'
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-1" asChild>
            <Link to="/admin/patients">
              <ArrowLeft className="h-4 w-4" />
              Back to Patients
            </Link>
          </Button>
          <Button onClick={handleEditProfile}>
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Patient Profile
          </Button>
        </div>

        <STLUploadDialog
          open={isUploadingSTL}
          onOpenChange={setIsUploadingSTL}
          patientId={id!}
          onUploadComplete={fetchPatientData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage 
                    src={profile.profile_image_url || ''} 
                    alt={`${profile.first_name} ${profile.last_name}`} 
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">
                  {profile.first_name} {profile.last_name}
                </CardTitle>
                <CardDescription className="text-center flex flex-wrap justify-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                    Active Patient
                  </Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <Separator />
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm break-all">{profile.email}</span>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.phone || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start py-1">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.address || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Personal Details</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">{formatDate(profile.date_of_birth)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm">{calculateAge(profile.date_of_birth)} years</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Emergency Contact</p>
                      <p className="text-sm">{profile.emergency_contact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Insurance Information</h3>
                  <Separator />
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="text-sm">{profile.insurance_provider || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Policy Number</p>
                      <p className="text-sm">{profile.insurance_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Quick Overview Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Invoices</p>
                    <p className="text-2xl font-bold">{invoices.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <ScrollText className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Treatments</p>
                    <p className="text-2xl font-bold">{treatments.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Tag className="h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">{documents.length}</p>
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
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-4 md:p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
                      {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.slice(0, 3).map(appt => (
                          <Card key={appt.id} className="mb-2">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{appt.appointment_type}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(appt.appointment_date)} • {appt.appointment_time}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {appt.dentist_name}
                                  </p>
                                </div>
                                <Badge>{appt.status}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No upcoming appointments</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Recent Treatments</h3>
                      {treatments.length > 0 ? (
                        treatments.slice(0, 3).map(treatment => (
                          <Card key={treatment.id} className="mb-2">
                            <CardContent className="p-4">
                              <h4 className="font-medium">{treatment.procedure_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(treatment.treatment_date)} • {treatment.dentist_name}
                              </p>
                              {treatment.details && (
                                <p className="text-sm mt-1">{treatment.details}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No treatment history</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Appointments</h3>
                      <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Appointment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Schedule New Appointment</DialogTitle>
                            <DialogDescription>
                              Schedule a new appointment for this patient
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Appointment Type *</Label>
                              <Input
                                value={newAppointment.appointment_type}
                                onChange={(e) => setNewAppointment({...newAppointment, appointment_type: e.target.value})}
                                placeholder="e.g., Cleaning, Consultation"
                              />
                            </div>
                            <div>
                              <Label>Dentist Name *</Label>
                              <Input
                                value={newAppointment.dentist_name}
                                onChange={(e) => setNewAppointment({...newAppointment, dentist_name: e.target.value})}
                                placeholder="Dr. Smith"
                              />
                            </div>
                            <div>
                              <Label>Date *</Label>
                              <Input
                                type="date"
                                value={newAppointment.appointment_date}
                                onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Time *</Label>
                              <Input
                                type="time"
                                value={newAppointment.appointment_time}
                                onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={newAppointment.notes}
                                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                                placeholder="Additional notes..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingAppointment(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddAppointment}>
                              Schedule
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Dentist</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appt) => (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">{appt.appointment_type}</TableCell>
                            <TableCell>
                              {formatDate(appt.appointment_date)}<br />
                              <span className="text-xs text-muted-foreground">{appt.appointment_time}</span>
                            </TableCell>
                            <TableCell>{appt.dentist_name}</TableCell>
                            <TableCell><Badge>{appt.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* Treatments Tab */}
                  <TabsContent value="treatments" className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Treatment History</h3>
                      <Dialog open={isAddingTreatment} onOpenChange={setIsAddingTreatment}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <FilePlus className="mr-2 h-4 w-4" />
                            Add Treatment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Treatment</DialogTitle>
                            <DialogDescription>
                              Record a new treatment for this patient
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Select Treatment *</Label>
                              <TreatmentSelector
                                onSelect={(procedureId, procedureName, categoryName) => {
                                  setNewTreatment({
                                    ...newTreatment,
                                    procedure_id: procedureId,
                                    procedure_name: procedureName,
                                    category_name: categoryName
                                  });
                                }}
                                selectedProcedureId={newTreatment.procedure_id}
                              />
                            </div>
                            <div>
                              <Label>Dentist Name *</Label>
                              <Input
                                value={newTreatment.dentist_name}
                                onChange={(e) => setNewTreatment({...newTreatment, dentist_name: e.target.value})}
                                placeholder="Dr. Smith"
                              />
                            </div>
                            <div>
                              <Label>Tooth Number</Label>
                              <Input
                                value={newTreatment.tooth_number}
                                onChange={(e) => setNewTreatment({...newTreatment, tooth_number: e.target.value})}
                                placeholder="e.g., #12"
                              />
                            </div>
                            <div>
                              <Label>Treatment Date *</Label>
                              <Input
                                type="date"
                                value={newTreatment.treatment_date}
                                onChange={(e) => setNewTreatment({...newTreatment, treatment_date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Details</Label>
                              <Textarea
                                value={newTreatment.details}
                                onChange={(e) => setNewTreatment({...newTreatment, details: e.target.value})}
                                placeholder="Treatment details..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingTreatment(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddTreatment}>
                              Add Treatment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Procedure</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Dentist</TableHead>
                          <TableHead>Tooth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {treatments.map((treatment) => (
                          <TableRow key={treatment.id}>
                            <TableCell className="font-medium">{treatment.procedure_name}</TableCell>
                            <TableCell>{formatDate(treatment.treatment_date)}</TableCell>
                            <TableCell>{treatment.dentist_name}</TableCell>
                            <TableCell>{treatment.tooth_number || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* Documents Tab */}
                  <TabsContent value="documents" className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Documents</h3>
                      <Button onClick={() => setIsUploadingSTL(true)}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Upload STL File
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.document_name}</TableCell>
                            <TableCell>{doc.document_type}</TableCell>
                            <TableCell>{formatDate(doc.upload_date)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* Billing Tab */}
                  <TabsContent value="billing" className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <Dialog open={isAddingInvoice} onOpenChange={setIsAddingInvoice}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <FilePlus className="mr-2 h-4 w-4" />
                            Add Invoice
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New Invoice</DialogTitle>
                            <DialogDescription>
                              Generate a new invoice for this patient
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Invoice Number</Label>
                              <Input
                                placeholder="Auto-generated if empty"
                                value={newInvoice.invoice_number}
                                onChange={(e) => setNewInvoice({...newInvoice, invoice_number: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Invoice Date *</Label>
                              <Input
                                type="date"
                                value={newInvoice.invoice_date}
                                onChange={(e) => setNewInvoice({...newInvoice, invoice_date: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Due Date</Label>
                              <Input
                                type="date"
                                value={newInvoice.due_date}
                                onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Service Type *</Label>
                              <Input
                                placeholder="e.g., Root Canal, Cleaning"
                                value={newInvoice.service_type}
                                onChange={(e) => setNewInvoice({...newInvoice, service_type: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Total Amount *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newInvoice.total_amount}
                                onChange={(e) => setNewInvoice({...newInvoice, total_amount: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Insurance Covered</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newInvoice.insurance_covered}
                                onChange={(e) => setNewInvoice({...newInvoice, insurance_covered: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Amount Paid</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newInvoice.amount_paid}
                                onChange={(e) => setNewInvoice({...newInvoice, amount_paid: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select 
                                value={newInvoice.status} 
                                onValueChange={(value: 'pending' | 'paid' | 'overdue' | 'cancelled') => 
                                  setNewInvoice({...newInvoice, status: value})
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="overdue">Overdue</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="col-span-2 space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Add invoice details..."
                                value={newInvoice.description}
                                onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingInvoice(false)}>Cancel</Button>
                            <Button onClick={handleAddInvoice}>Create Invoice</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                            <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                            <TableCell>{invoice.description}</TableCell>
                            <TableCell>${invoice.total_amount.toFixed(2)}</TableCell>
                            <TableCell><Badge>{invoice.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Patient Profile</DialogTitle>
              <DialogDescription>
                Update patient information. Changes will be reflected in the Patient Portal.
              </DialogDescription>
            </DialogHeader>
            {editedProfile && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={editedProfile.first_name}
                      onChange={(e) => setEditedProfile({...editedProfile, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={editedProfile.last_name}
                      onChange={(e) => setEditedProfile({...editedProfile, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editedProfile.address || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={editedProfile.date_of_birth || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={editedProfile.emergency_contact || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, emergency_contact: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_provider">Insurance Provider</Label>
                  <Select
                    value={editedProfile.insurance_provider || ''}
                    onValueChange={(value) => setEditedProfile({...editedProfile, insurance_provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="delta">Delta Dental</SelectItem>
                      <SelectItem value="humana">Humana</SelectItem>
                      <SelectItem value="metlife">MetLife</SelectItem>
                      <SelectItem value="unitedhealth">UnitedHealthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="none">None / Self-Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="insurance_number">Insurance ID/Number</Label>
                  <Input
                    id="insurance_number"
                    value={editedProfile.insurance_number || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, insurance_number: e.target.value})}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PatientDetailsConnected;
