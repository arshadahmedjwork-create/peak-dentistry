import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAllPatients } from '@/hooks/use-supabase-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileText, Filter, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import PaymentsTab from './PaymentsTab';

const BillingManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { patients } = useAllPatients();
  
  const [newInvoice, setNewInvoice] = useState({
    patient_id: '',
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
    fetchInvoices();
  }, []);
  
  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .order('invoice_date', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateInvoice = async () => {
    if (!newInvoice.patient_id || !newInvoice.service_type || !newInvoice.total_amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Generate invoice number if not provided
    const invoiceNumber = newInvoice.invoice_number || `INV-${Date.now().toString().slice(-6)}`;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .insert([{
          ...newInvoice,
          invoice_number: invoiceNumber,
          total_amount: Number(newInvoice.total_amount),
          insurance_covered: Number(newInvoice.insurance_covered),
          amount_paid: Number(newInvoice.amount_paid)
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Invoice Created",
        description: "Invoice has been created successfully"
      });
      
      setIsCreateDialogOpen(false);
      setNewInvoice({
        patient_id: '',
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
      fetchInvoices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateStatus = async (invoiceId: string, newStatus: 'pending' | 'paid' | 'overdue' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoiceId);
      
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: "Invoice status has been updated"
      });
      
      fetchInvoices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Filter invoices based on search query and status filter
  const filteredInvoices = invoices.filter(invoice => {
    const patientName = invoice.profiles 
      ? `${invoice.profiles.first_name} ${invoice.profiles.last_name}` 
      : '';
    
    const matchesSearch = 
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.service_type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Billing Management</h1>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Invoices
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for a patient.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select value={newInvoice.patient_id} onValueChange={(value) => setNewInvoice({...newInvoice, patient_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input 
                      placeholder="Auto-generated if empty"
                      value={newInvoice.invoice_number}
                      onChange={(e) => setNewInvoice({...newInvoice, invoice_number: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Invoice Date</Label>
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
                    <Label>Service Type</Label>
                    <Input 
                      placeholder="e.g., Root Canal, Cleaning"
                      value={newInvoice.service_type}
                      onChange={(e) => setNewInvoice({...newInvoice, service_type: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Total Amount</Label>
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
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateInvoice}>Create Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="invoices">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>Manage and track all patient invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center gap-2 min-w-48">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                            <TableCell>
                              {invoice.profiles 
                                ? `${invoice.profiles.first_name} ${invoice.profiles.last_name}` 
                                : 'Unknown'}
                            </TableCell>
                            <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                            <TableCell>{invoice.service_type}</TableCell>
                            <TableCell>{formatCurrency(Number(invoice.total_amount))}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {invoice.status !== 'paid' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                                  >
                                    <CreditCard className="h-4 w-4 mr-1" /> Mark Paid
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            {loading ? 'Loading invoices...' : 'No invoices found matching your search criteria.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsTab />
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Access and generate financial reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Financial reporting tools - see Reports Generator for detailed analytics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BillingManagement;
