import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, RefreshCw, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('year');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  
  // Financial data
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgPerPatient, setAvgPerPatient] = useState(0);
  const [outstandingBalances, setOutstandingBalances] = useState(0);
  
  // Patient data
  const [patientData, setPatientData] = useState<any[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [newPatients, setNewPatients] = useState(0);
  const [retentionRate, setRetentionRate] = useState(0);
  
  // Service data
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [mostCommon, setMostCommon] = useState('');
  const [highestRevenue, setHighestRevenue] = useState('');
  
  useEffect(() => {
    fetchReportData();
  }, [dateRange, startDate, endDate]);
  
  const fetchReportData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFinancialData(),
        fetchPatientAnalytics(),
        fetchServiceBreakdown()
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFinancialData = async () => {
    // Fetch all invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*');
    
    if (!invoices) return;
    
    // Calculate monthly revenue
    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    invoices.forEach(inv => {
      const date = new Date(inv.invoice_date);
      const monthName = months[date.getMonth()];
      if (!monthlyData[monthName]) monthlyData[monthName] = 0;
      monthlyData[monthName] += Number(inv.total_amount);
    });
    
    const revenueData = months.map(month => ({
      name: month,
      revenue: monthlyData[month] || 0
    }));
    
    setMonthlyRevenue(revenueData);
    
    // Calculate total revenue (paid invoices)
    const paidTotal = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.total_amount), 0);
    setTotalRevenue(paidTotal);
    
    // Calculate outstanding balances
    const outstanding = invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + (Number(inv.total_amount) - Number(inv.amount_paid)), 0);
    setOutstandingBalances(outstanding);
    
    // Fetch patient count for avg calculation
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      setAvgPerPatient(paidTotal / count);
    }
  };
  
  const fetchPatientAnalytics = async () => {
    // Fetch all profiles
    const { data: profiles, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    if (!profiles) return;
    
    setTotalPatients(count || 0);
    
    // Calculate new patients by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const newPatientsData = profiles.filter(p => 
      new Date(p.created_at) >= sixMonthsAgo
    );
    
    setNewPatients(newPatientsData.length);
    
    // Group new patients by month
    const monthlyPatients: Record<string, { new: number, returning: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      monthlyPatients[monthName] = { new: 0, returning: 0 };
    }
    
    newPatientsData.forEach(p => {
      const date = new Date(p.created_at);
      const monthName = months[date.getMonth()];
      if (monthlyPatients[monthName]) {
        monthlyPatients[monthName].new++;
      }
    });
    
    // Get appointments to calculate returning patients
    const { data: appointments } = await supabase
      .from('appointments')
      .select('patient_id, appointment_date');
    
    if (appointments) {
      appointments.forEach(appt => {
        const date = new Date(appt.appointment_date);
        const monthName = months[date.getMonth()];
        if (monthlyPatients[monthName]) {
          monthlyPatients[monthName].returning++;
        }
      });
    }
    
    const patientChartData = Object.keys(monthlyPatients)
      .reverse()
      .map(month => ({
        month,
        new: monthlyPatients[month].new,
        returning: monthlyPatients[month].returning
      }));
    
    setPatientData(patientChartData);
    
    // Calculate retention rate
    if (appointments && appointments.length > 0) {
      const returningCount = new Set(appointments.map(a => a.patient_id)).size;
      const rate = (returningCount / (count || 1)) * 100;
      setRetentionRate(Math.round(rate));
    }
  };
  
  const fetchServiceBreakdown = async () => {
    // Fetch all treatments and appointments
    const { data: treatments } = await supabase
      .from('treatments')
      .select('procedure_name');
    
    const { data: appointments } = await supabase
      .from('appointments')
      .select('appointment_type');
    
    // Count procedures
    const procedureCounts: Record<string, number> = {};
    
    if (treatments) {
      treatments.forEach(t => {
        const name = t.procedure_name;
        procedureCounts[name] = (procedureCounts[name] || 0) + 1;
      });
    }
    
    if (appointments) {
      appointments.forEach(a => {
        const name = a.appointment_type;
        procedureCounts[name] = (procedureCounts[name] || 0) + 1;
      });
    }
    
    // Convert to chart data
    const total = Object.values(procedureCounts).reduce((sum, count) => sum + count, 0);
    const chartData = Object.entries(procedureCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    
    setServiceData(chartData);
    
    if (chartData.length > 0) {
      setMostCommon(chartData[0].name);
      // For highest revenue, we'd need treatment costs - using most common for now
      setHighestRevenue(chartData[0].name);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Reports Generator</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchReportData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="financial" onValueChange={setReportType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="patient">Patient Analytics</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 my-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm">Start Date</span>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">End Date</span>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            )}
          </div>
          
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>
                  Monthly revenue and financial metrics for the practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">From paid invoices</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Per Patient</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">${avgPerPatient.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Revenue per patient</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Outstanding Balances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">${outstandingBalances.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Pending payments</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Analytics</CardTitle>
                <CardDescription>
                  New vs. returning patient metrics and demographics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={patientData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="#8884d8" activeDot={{ r: 8 }} name="New Patients" />
                      <Line type="monotone" dataKey="returning" stroke="#82ca9d" name="Returning Patients" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{totalPatients}</p>
                      <p className="text-xs text-muted-foreground">Active patients</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{newPatients}</p>
                      <p className="text-xs text-muted-foreground">Last 6 months</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{retentionRate}%</p>
                      <p className="text-xs text-muted-foreground">Returning patients</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services Breakdown</CardTitle>
                <CardDescription>
                  Distribution of dental procedures and services provided.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Most Common</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{mostCommon || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Most frequent service</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Highest Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{highestRevenue || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Top revenue service</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{serviceData.reduce((sum, s) => sum + s.value, 0)}</p>
                      <p className="text-xs text-muted-foreground">Services provided</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsGenerator;
