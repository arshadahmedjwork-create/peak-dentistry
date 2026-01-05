
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import ProfileSection from './account-settings/ProfileSection';
import NotificationSection from './account-settings/NotificationSection';
import SecuritySection from './account-settings/SecuritySection';

interface AccountSettingsProps {
  userProfile: any;
  onProfileUpdate: (profileData: any) => void;
  notificationPreferences: any[];
  notificationsEnabled: Record<string, boolean>;
  onNotificationChange: (id: string, checked: boolean) => void;
  onDeleteAccount?: () => void;
}

const AccountSettings = ({ 
  userProfile, 
  onProfileUpdate, 
  notificationPreferences, 
  notificationsEnabled, 
  onNotificationChange,
  onDeleteAccount
}: AccountSettingsProps) => {
  const [localProfile, setLocalProfile] = useState({ ...userProfile });
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleProfileChange = (updatedProfile: any) => {
    setLocalProfile(updatedProfile);
  };
  
  const handleSaveChanges = () => {
    onProfileUpdate(localProfile);
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated successfully.",
    });
  };
  
  return (
    <div className="px-4 py-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 flex-1 overflow-auto">
          <TabsContent value="profile" className="h-full">
            <ProfileSection 
              userProfile={localProfile} 
              onProfileChange={handleProfileChange} 
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="h-full">
            <NotificationSection 
              notificationPreferences={notificationPreferences}
              notificationsEnabled={notificationsEnabled}
              onNotificationChange={onNotificationChange}
            />
          </TabsContent>
          
          <TabsContent value="security" className="h-full">
            <SecuritySection onDeleteAccount={onDeleteAccount} />
          </TabsContent>
        </div>
      </Tabs>
      
      {activeTab === "profile" && (
        <div className="mt-6 pt-4 border-t">
          <Button onClick={handleSaveChanges} className="w-full">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
