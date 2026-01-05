import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import ProfileSection from './account-settings/ProfileSection';
import NotificationSection from './account-settings/NotificationSection';
import SecuritySection from './account-settings/SecuritySection';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: any;
  onProfileUpdate: (profileData: any) => void;
  notificationPreferences: any[];
  notificationsEnabled: Record<string, boolean>;
  onNotificationChange: (id: string, checked: boolean) => void;
  onDeleteAccount?: () => void;
}

const SettingsModal = ({ 
  open,
  onOpenChange,
  userProfile, 
  onProfileUpdate, 
  notificationPreferences, 
  notificationsEnabled, 
  onNotificationChange,
  onDeleteAccount
}: SettingsModalProps) => {
  // Map database fields to camelCase for the component
  const normalizedProfile = {
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    dateOfBirth: userProfile?.date_of_birth || '',
    address: userProfile?.address || '',
    emergencyContact: userProfile?.emergency_contact || '',
    insuranceProvider: userProfile?.insurance_provider || '',
    insuranceNumber: userProfile?.insurance_number || ''
  };
  
  const [localProfile, setLocalProfile] = useState(normalizedProfile);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Update local profile when userProfile prop changes
  useEffect(() => {
    const updated = {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      dateOfBirth: userProfile?.date_of_birth || '',
      address: userProfile?.address || '',
      emergencyContact: userProfile?.emergency_contact || '',
      insuranceProvider: userProfile?.insurance_provider || '',
      insuranceNumber: userProfile?.insurance_number || ''
    };
    setLocalProfile(updated);
  }, [userProfile]);
  
  const handleProfileChange = (updatedProfile: any) => {
    setLocalProfile(updatedProfile);
  };
  
  const handleSaveChanges = () => {
    onProfileUpdate(localProfile);
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated successfully.",
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    const reset = {
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      dateOfBirth: userProfile?.date_of_birth || '',
      address: userProfile?.address || '',
      emergencyContact: userProfile?.emergency_contact || '',
      insuranceProvider: userProfile?.insurance_provider || '',
      insuranceNumber: userProfile?.insurance_number || ''
    };
    setLocalProfile(reset);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">Account Settings</DialogTitle>
          <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="profile">
                <ProfileSection 
                  userProfile={localProfile} 
                  onProfileChange={handleProfileChange} 
                />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationSection 
                  notificationPreferences={notificationPreferences}
                  notificationsEnabled={notificationsEnabled}
                  onNotificationChange={onNotificationChange}
                />
              </TabsContent>
              
              <TabsContent value="security">
                <SecuritySection onDeleteAccount={onDeleteAccount} />
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
        
        <div className="flex gap-3 px-6 py-4 border-t">
          <Button onClick={handleCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} className="flex-1">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
