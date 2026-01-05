
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortalTabNavigationProps {
  activeTab: string;
}

const PortalTabNavigation = ({ activeTab }: PortalTabNavigationProps) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-muted rounded-none border-y">
      <TabsTrigger value="dashboard" className="rounded-none">Dashboard</TabsTrigger>
      <TabsTrigger value="appointments" className="rounded-none">Appointments</TabsTrigger>
      <TabsTrigger value="treatments" className="rounded-none">Treatments</TabsTrigger>
      <TabsTrigger value="documents" className="rounded-none">Documents</TabsTrigger>
      <TabsTrigger value="billing" className="rounded-none">Billing</TabsTrigger>
    </TabsList>
  );
};

export default PortalTabNavigation;
