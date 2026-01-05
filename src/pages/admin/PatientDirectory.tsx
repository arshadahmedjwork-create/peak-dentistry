import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAllPatients } from '@/hooks/use-supabase-data';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SkeletonCard } from '@/components/ui/skeleton-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';
import AppointmentFormModal from '@/components/admin/AppointmentFormModal';
import { 
  UserPlus, 
  Search, 
  Filter, 
  FileEdit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Download,
  ArrowUpDown
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import { strongPasswordSchema } from '@/utils/form-validation';

const newPatientSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: strongPasswordSchema,
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15).optional(),
  date_of_birth: z.string().optional(),
});

const PatientDirectory = () => {
  const { patients, loading } = useAllPatients();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
  });
  
  const filteredPatients = (patients || []).filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const phone = (patient.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });
  
  // Pagination logic
  const patientsPerPage = 6;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredPatients.map(patient => ({
        'First Name': patient.first_name || '',
        'Last Name': patient.last_name || '',
        'Email': patient.email || '',
        'Phone': patient.phone || '',
        'Date of Birth': patient.date_of_birth || '',
        'Address': patient.address || '',
        'City': patient.city || '',
        'State': patient.state || '',
        'Zip Code': patient.zip_code || '',
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Patients');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `patients_${date}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      toast({
        title: 'Export Successful',
        description: `Patient data exported to ${filename}`,
      });
      setIsExportDialogOpen(false);
    } catch (error) {
      handleError(error, 'Failed to export to Excel');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Patient Directory', 14, 20);
      
      // Add date
      doc.setFontSize(10);
      const date = new Date().toLocaleDateString();
      doc.text(`Generated: ${date}`, 14, 28);
      
      // Prepare table data
      const tableData = filteredPatients.map(patient => [
        `${patient.first_name || ''} ${patient.last_name || ''}`,
        patient.email || '',
        patient.phone || '',
        patient.date_of_birth || '',
        `${patient.city || ''}, ${patient.state || ''}`,
      ]);

      // Add table
      autoTable(doc, {
        startY: 35,
        head: [['Name', 'Email', 'Phone', 'DOB', 'Location']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
      });

      // Generate filename
      const filename = `patients_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download file
      doc.save(filename);

      toast({
        title: 'Export Successful',
        description: `Patient data exported to ${filename}`,
      });
      setIsExportDialogOpen(false);
    } catch (error) {
      handleError(error, 'Failed to export to PDF');
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddPatient = async () => {
    // Validate inputs
    const result = newPatientSchema.safeParse(newPatient);
    if (!result.success) {
      const errorMessage = result.error.errors.map(err => err.message).join(', ');
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newPatient.email,
        password: newPatient.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: newPatient.first_name,
            last_name: newPatient.last_name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with additional details
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: newPatient.phone,
            date_of_birth: newPatient.date_of_birth || null,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "Patient account created successfully",
        });

        setIsAddDialogOpen(false);
        setNewPatient({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone: '',
          date_of_birth: '',
        });
        window.location.reload();
      }
    } catch (error: any) {
      const safeMessage = handleError(error, 'Patient Account Creation');
      toast({
        title: "Error",
        description: safeMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">
              Manage your patient directory and patient records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Create a new patient account with login credentials
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={newPatient.first_name}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, first_name: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={newPatient.last_name}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, last_name: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPatient.password}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, password: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newPatient.date_of_birth}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddPatient}
                      disabled={isSubmitting || !newPatient.email || !newPatient.password || !newPatient.first_name || !newPatient.last_name}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Patient'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Patients</DropdownMenuItem>
                <DropdownMenuItem>New Patients</DropdownMenuItem>
                <DropdownMenuItem>Active Treatment</DropdownMenuItem>
                <DropdownMenuItem>Insurance Expiring</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Patient Data</DialogTitle>
                  <DialogDescription>
                    Choose the format to export {filteredPatients.length} patient(s)
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-4">
                  <Button
                    onClick={handleExportExcel}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as Excel (.xlsx)
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF (.pdf)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Tabs 
              defaultValue="grid" 
              value={view} 
              onValueChange={(v) => setView(v as 'grid' | 'table')}
              className="hidden md:block"
            >
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-current rounded-sm" />
                    ))}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="table" className="px-3">
                  <div className="flex flex-col gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-5 h-1 bg-current rounded-sm" />
                    ))}
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {loading ? (
          <SkeletonCard numberOfLines={8} />
        ) : filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No patients match your search criteria. Try adjusting your search.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : view === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentPatients.map((patient) => {
              return (
                <Card key={patient.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={patient.profile_image_url || ''} alt={`${patient.first_name} ${patient.last_name}`} />
                          <AvatarFallback>
                            {patient.first_name?.[0]}{patient.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {patient.first_name} {patient.last_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                              Active
                            </Badge>
                            <span className="text-xs">{patient.appointments_count || 0} appts</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/patients/${patient.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-[16px_1fr] gap-2 items-start">
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate" title={patient.email || ''}>
                          {patient.email || 'No email'}
                        </span>
                      </div>
                      <div className="grid grid-cols-[16px_1fr] gap-2 items-start">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{patient.phone || 'No phone'}</span>
                      </div>
                      <div className="grid grid-cols-[16px_1fr] gap-2 items-start">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate" title={patient.address || ''}>
                          {patient.address ? patient.address.split(',')[0] : 'No address'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/admin/patients/${patient.id}`}>
                          <FileEdit className="mr-2 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsScheduleOpen(true);
                        }}
                      >
                        <Calendar className="mr-2 h-3 w-3" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center gap-1">
                        Patient
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Next Appointment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPatients.map((patient) => {
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage 
                                src={patient.profile_image_url || ''} 
                                alt={`${patient.first_name} ${patient.last_name}`} 
                              />
                              <AvatarFallback>
                                {patient.first_name?.[0]}{patient.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                DOB: {formatDate(patient.date_of_birth)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {patient.email || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" /> {patient.phone || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.insurance_provider || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">
                              #{patient.insurance_number || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.treatments_count || 0} treatments</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.appointments_count || 0} appointments</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/patients/${patient.id}`}>
                                <FileEdit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {filteredPatients.length > patientsPerPage && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <AppointmentFormModal
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        onSuccess={() => {}}
        preselectedPatient={selectedPatient}
      />
    </AdminLayout>
  );
};

export default PatientDirectory;
