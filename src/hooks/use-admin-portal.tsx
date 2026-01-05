/**
 * @deprecated SECURITY WARNING: This hook uses localStorage for authentication which is insecure.
 * It stores admin credentials in client-side storage that can be easily manipulated.
 * Hardcoded password 'admin@peak' is visible in source code.
 * DO NOT USE THIS HOOK FOR NEW FEATURES.
 * Use the proper Supabase authentication via useAuth hook instead.
 * This file is kept only for backward compatibility with legacy components.
 */

import { useState } from 'react';
import { useLocalStorage } from './use-local-storage';
import { toast } from './use-toast';
import { UserProfile } from './use-patient-portal';

export type AdminRole = 'super-admin' | 'receptionist' | 'staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin?: string;
}

export interface Patient {
  id: string;
  profile: UserProfile;
  appointments: Appointment[];
  treatments: Treatment[];
  documents: Document[];
  billing: BillingRecord[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: string;
  dentist: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  date: string;
  procedure: string;
  dentist: string;
  details: string;
  status: 'planned' | 'in-progress' | 'completed';
  followUp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  patientId: string;
  title: string;
  type: 'prescription' | 'report' | 'x-ray' | 'scan' | 'other';
  fileUrl: string;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: BillingItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Note {
  id: string;
  patientId: string;
  content: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface DashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  completedTreatments: number;
  newPatients: number;
  upcomingFollowUps: number;
  overdueBillings: number;
  totalRevenue: number;
}

export function useAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('adminIsAuthenticated', false);
  const [currentAdmin, setCurrentAdmin] = useLocalStorage<AdminUser | null>('currentAdmin', null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mock admin users for demo
  const adminUsers: AdminUser[] = [
    {
      id: '1',
      name: 'Dr. Sarah Miller',
      email: '',
      role: 'super-admin',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      lastLogin: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jenny Smith',
      email: 'reception@peakdentistry.com',
      role: 'receptionist',
      avatar: 'https://i.pravatar.cc/150?u=reception',
      lastLogin: new Date(Date.now() - 86400000).toISOString() // yesterday
    }
  ];
  
  const handleAdminLogin = (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const admin = adminUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (admin && password === 'admin@peak') { // Updated password
        setIsAuthenticated(true);
        setCurrentAdmin({
          ...admin,
          lastLogin: new Date().toISOString()
        });
        toast({
          title: "Login Successful",
          description: `Welcome back, ${admin.name}!`
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setActiveSection('dashboard');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };
  
  // Dashboard stats (mock data)
  const getDashboardStats = (): DashboardStats => {
    return {
      todayAppointments: 15,
      pendingAppointments: 42,
      completedTreatments: 8,
      newPatients: 3,
      upcomingFollowUps: 7,
      overdueBillings: 5,
      totalRevenue: 15650
    };
  };
  
  // Patient management functions
  const getPatients = () => {
    // In a real app, this would fetch from API
    return mockPatients;
  };
  
  const getPatientById = (id: string) => {
    return mockPatients.find(p => p.id === id) || null;
  };
  
  const updatePatient = (patientId: string, updatedData: Partial<UserProfile>) => {
    // In a real app, this would call an API
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock update
      const patientIndex = mockPatients.findIndex(p => p.id === patientId);
      if (patientIndex >= 0) {
        mockPatients[patientIndex].profile = {
          ...mockPatients[patientIndex].profile,
          ...updatedData,
          lastUpdated: new Date().toISOString()
        };
        
        toast({
          title: "Patient Updated",
          description: "Patient information has been updated successfully."
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  // Appointment management
  const getAppointments = () => {
    // Collect all appointments from all patients
    return mockPatients.flatMap(p => p.appointments);
  };
  
  const getAppointmentsForPatient = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient?.appointments || [];
  };
  
  const createAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const now = new Date().toISOString();
      const newAppointment: Appointment = {
        ...appointment,
        id: `appt-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      
      // Add to patient's appointments
      const patientIndex = mockPatients.findIndex(p => p.id === appointment.patientId);
      if (patientIndex >= 0) {
        mockPatients[patientIndex].appointments.push(newAppointment);
        mockPatients[patientIndex].updatedAt = now;
        
        toast({
          title: "Appointment Created",
          description: "The appointment has been scheduled successfully."
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Find appointment in patients
      let updated = false;
      
      for (const patient of mockPatients) {
        const appointmentIndex = patient.appointments.findIndex(a => a.id === appointmentId);
        
        if (appointmentIndex >= 0) {
          patient.appointments[appointmentIndex] = {
            ...patient.appointments[appointmentIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          patient.updatedAt = new Date().toISOString();
          updated = true;
          break;
        }
      }
      
      if (updated) {
        toast({
          title: "Appointment Updated",
          description: "The appointment has been updated successfully."
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  // Billing functions
  const createInvoice = (patientId: string, invoice: Omit<BillingRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const now = new Date().toISOString();
      const newInvoice: BillingRecord = {
        ...invoice,
        id: `inv-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      
      const patientIndex = mockPatients.findIndex(p => p.id === patientId);
      if (patientIndex >= 0) {
        mockPatients[patientIndex].billing.push(newInvoice);
        mockPatients[patientIndex].updatedAt = now;
        
        toast({
          title: "Invoice Created",
          description: `Invoice #${newInvoice.invoiceNumber} has been created.`
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  // Treatment management
  const createTreatment = (treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const now = new Date().toISOString();
      const newTreatment: Treatment = {
        ...treatment,
        id: `treat-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      
      const patientIndex = mockPatients.findIndex(p => p.id === treatment.patientId);
      if (patientIndex >= 0) {
        mockPatients[patientIndex].treatments.push(newTreatment);
        mockPatients[patientIndex].updatedAt = now;
        
        toast({
          title: "Treatment Record Created",
          description: "The treatment record has been added successfully."
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  return {
    // Auth
    isAuthenticated,
    currentAdmin,
    isLoading,
    activeSection,
    setActiveSection,
    handleAdminLogin,
    handleAdminLogout,
    
    // Dashboard
    getDashboardStats,
    
    // Patient management
    getPatients,
    getPatientById,
    updatePatient,
    
    // Appointment management
    getAppointments,
    getAppointmentsForPatient,
    createAppointment,
    updateAppointment,
    
    // Billing management
    createInvoice,
    
    // Treatment management
    createTreatment
  };
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "p1",
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1985-06-15",
      address: "123 Main Street, Anytown, CA 94580",
      emergencyContact: "Jane Doe, (555) 987-6543",
      insuranceProvider: "Delta Dental",
      insuranceNumber: "DD-12345678",
      profileImageUrl: "https://i.pravatar.cc/150?u=p1",
      lastUpdated: "2023-05-10T14:30:00Z"
    },
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        patientName: "John Doe",
        date: "2023-05-20",
        time: "10:00 AM",
        duration: 60,
        type: "Regular Checkup",
        dentist: "Dr. Sarah Miller",
        notes: "Annual checkup and cleaning",
        status: "scheduled",
        createdAt: "2023-05-10T14:30:00Z",
        updatedAt: "2023-05-10T14:30:00Z"
      }
    ],
    treatments: [
      {
        id: "t1",
        patientId: "p1",
        date: "2023-04-15",
        procedure: "Dental Cleaning",
        dentist: "Dr. Michael Chen",
        details: "Regular scaling and cleaning performed. No cavities found.",
        status: "completed",
        createdAt: "2023-04-15T11:00:00Z",
        updatedAt: "2023-04-15T11:00:00Z"
      }
    ],
    documents: [
      {
        id: "d1",
        patientId: "p1",
        title: "Dental X-Ray",
        type: "x-ray",
        fileUrl: "/sample-documents/x-ray-1.pdf",
        thumbnail: "/sample-documents/x-ray-1-thumb.jpg",
        uploadedBy: "Dr. Michael Chen",
        uploadedAt: "2023-04-15T11:30:00Z"
      }
    ],
    billing: [
      {
        id: "b1",
        patientId: "p1",
        invoiceNumber: "INV-2023-0415",
        date: "2023-04-15",
        dueDate: "2023-05-15",
        items: [
          {
            id: "bi1",
            description: "Dental Cleaning",
            quantity: 1,
            unitPrice: 120,
            total: 120
          },
          {
            id: "bi2",
            description: "Dental X-Ray",
            quantity: 1,
            unitPrice: 85,
            total: 85
          }
        ],
        subtotal: 205,
        tax: 16.40,
        total: 221.40,
        status: "paid",
        paymentMethod: "Credit Card",
        paymentDate: "2023-04-15",
        createdAt: "2023-04-15T12:00:00Z",
        updatedAt: "2023-04-15T12:00:00Z"
      }
    ],
    notes: [
      {
        id: "n1",
        patientId: "p1",
        content: "Patient has a history of sensitivity to cold. Recommended special toothpaste.",
        author: "Dr. Sarah Miller",
        createdAt: "2023-04-15T11:15:00Z",
        isPrivate: true
      }
    ],
    createdAt: "2023-01-10T09:00:00Z",
    updatedAt: "2023-05-10T14:30:00Z"
  },
  {
    id: "p2",
    profile: {
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
      phone: "(555) 867-5309",
      dateOfBirth: "1990-09-22",
      address: "456 Oak Avenue, Somewhere, CA 94581",
      emergencyContact: "Robert Johnson, (555) 234-5678",
      insuranceProvider: "Aetna Dental",
      insuranceNumber: "AD-87654321",
      profileImageUrl: "https://i.pravatar.cc/150?u=p2",
      lastUpdated: "2023-05-05T10:15:00Z"
    },
    appointments: [
      {
        id: "a2",
        patientId: "p2",
        patientName: "Emily Johnson",
        date: "2023-05-25",
        time: "2:30 PM",
        duration: 90,
        type: "Root Canal",
        dentist: "Dr. Robert Williams",
        notes: "First session of root canal treatment",
        status: "scheduled",
        createdAt: "2023-05-05T10:30:00Z",
        updatedAt: "2023-05-05T10:30:00Z"
      }
    ],
    treatments: [
      {
        id: "t2",
        patientId: "p2",
        date: "2023-03-20",
        procedure: "Cavity Filling",
        dentist: "Dr. Sarah Miller",
        details: "Filled two cavities on upper left molars. Used composite material.",
        status: "completed",
        createdAt: "2023-03-20T15:45:00Z",
        updatedAt: "2023-03-20T15:45:00Z"
      }
    ],
    documents: [
      {
        id: "d2",
        patientId: "p2",
        title: "Dental Treatment Plan",
        type: "report",
        fileUrl: "/sample-documents/treatment-plan-emily.pdf",
        uploadedBy: "Dr. Sarah Miller",
        uploadedAt: "2023-03-20T16:00:00Z"
      }
    ],
    billing: [
      {
        id: "b2",
        patientId: "p2",
        invoiceNumber: "INV-2023-0320",
        date: "2023-03-20",
        dueDate: "2023-04-20",
        items: [
          {
            id: "bi3",
            description: "Cavity Filling (2)",
            quantity: 2,
            unitPrice: 150,
            total: 300
          }
        ],
        subtotal: 300,
        tax: 24,
        total: 324,
        status: "paid",
        paymentMethod: "Insurance + Copay",
        paymentDate: "2023-03-20",
        createdAt: "2023-03-20T16:15:00Z",
        updatedAt: "2023-03-20T16:15:00Z"
      }
    ],
    notes: [
      {
        id: "n2",
        patientId: "p2",
        content: "Patient is anxious about dental procedures. Recommended mild sedation for future treatments.",
        author: "Dr. Sarah Miller",
        createdAt: "2023-03-20T16:20:00Z",
        isPrivate: true
      }
    ],
    createdAt: "2023-02-15T11:30:00Z",
    updatedAt: "2023-05-05T10:30:00Z"
  },
  {
    id: "p3",
    profile: {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      dateOfBirth: "1975-12-03",
      address: "789 Pine Street, Elsewhere, CA 94582",
      emergencyContact: "Susan Brown, (555) 901-2345",
      insuranceProvider: "MetLife Dental",
      insuranceNumber: "ML-98765432",
      profileImageUrl: "https://i.pravatar.cc/150?u=p3",
      lastUpdated: "2023-04-28T09:45:00Z"
    },
    appointments: [
      {
        id: "a3",
        patientId: "p3",
        patientName: "Michael Brown",
        date: "2023-06-05",
        time: "11:15 AM",
        duration: 45,
        type: "Crown Fitting",
        dentist: "Dr. Jennifer Lee",
        notes: "Final crown fitting for lower right molar",
        status: "scheduled",
        createdAt: "2023-04-28T10:00:00Z",
        updatedAt: "2023-04-28T10:00:00Z"
      }
    ],
    treatments: [
      {
        id: "t3",
        patientId: "p3",
        date: "2023-05-15",
        procedure: "Crown Preparation",
        dentist: "Dr. Jennifer Lee",
        details: "Prepared tooth for crown. Temporary crown placed.",
        status: "completed",
        followUp: "2023-06-05",
        createdAt: "2023-05-15T12:30:00Z",
        updatedAt: "2023-05-15T12:30:00Z"
      }
    ],
    documents: [
      {
        id: "d3",
        patientId: "p3",
        title: "Crown Preparation Images",
        type: "scan",
        fileUrl: "/sample-documents/crown-scan.pdf",
        thumbnail: "/sample-documents/crown-scan-thumb.jpg",
        uploadedBy: "Dr. Jennifer Lee",
        uploadedAt: "2023-05-15T13:00:00Z"
      }
    ],
    billing: [
      {
        id: "b3",
        patientId: "p3",
        invoiceNumber: "INV-2023-0515",
        date: "2023-05-15",
        dueDate: "2023-06-15",
        items: [
          {
            id: "bi4",
            description: "Crown Preparation",
            quantity: 1,
            unitPrice: 600,
            total: 600
          },
          {
            id: "bi5",
            description: "Temporary Crown",
            quantity: 1,
            unitPrice: 150,
            total: 150
          }
        ],
        subtotal: 750,
        tax: 60,
        discount: 50,
        total: 760,
        status: "sent",
        createdAt: "2023-05-15T13:15:00Z",
        updatedAt: "2023-05-15T13:15:00Z"
      }
    ],
    notes: [
      {
        id: "n3",
        patientId: "p3",
        content: "Patient prefers appointments in the morning. Has slight gag reflex during impressions.",
        author: "Dr. Jennifer Lee",
        createdAt: "2023-05-15T13:20:00Z",
        isPrivate: true
      }
    ],
    createdAt: "2023-03-01T14:15:00Z",
    updatedAt: "2023-05-15T13:20:00Z"
  }
];
