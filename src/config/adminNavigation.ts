
import { BarChart3, Users, Calendar, FileText, PieChart, Shield } from 'lucide-react';

export const navigationItems = [
  { name: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
  { name: "Admins", icon: Shield, path: "/admin/manage-admins" },
  { name: "Patients", icon: Users, path: "/admin/patients" },
  { name: "Appointments", icon: Calendar, path: "/admin/appointments" },
  { name: "Billing", icon: FileText, path: "/admin/billing" },
  { name: "Reports", icon: PieChart, path: "/admin/reports" },
];
