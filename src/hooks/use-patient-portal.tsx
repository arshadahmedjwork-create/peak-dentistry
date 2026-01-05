
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { toast } from './use-toast';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  insuranceProvider: string;
  insuranceNumber: string;
  profileImageUrl?: string;
  lastUpdated?: string;
}

export interface NotificationPreference {
  id: string;
  label: string;  // Changed 'title' to 'label' to match the data structure
  description: string;
  checked: boolean;
  icon?: string;
}

export const usePatientPortal = (notificationPreferences: NotificationPreference[] = []) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Use our enhanced localStorage hook
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [isProfileComplete, setIsProfileComplete] = useLocalStorage<boolean>('isProfileComplete', false);
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    insuranceProvider: "",
    insuranceNumber: "",
  });

  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage<Record<string, boolean>>(
    'notificationsEnabled',
    Array.isArray(notificationPreferences) 
      ? notificationPreferences.reduce((acc, pref) => {
          acc[pref.id] = pref.checked;
          return acc;
        }, {} as Record<string, boolean>)
      : {}
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: "Welcome to your patient portal."
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("dashboard");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const handleProfileSubmit = (profileData: UserProfile) => {
    const updatedProfile = {
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    setUserProfile(updatedProfile);
    setIsProfileComplete(true);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotificationsEnabled(prev => ({ ...prev, [id]: checked }));
  };

  const deleteAccount = () => {
    // In a real app, you would call an API to delete the account
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    setUserProfile({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      emergencyContact: "",
      insuranceProvider: "",
      insuranceNumber: "",
    });
    
    // Clear localStorage
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isProfileComplete');
    localStorage.removeItem('notificationsEnabled');
    
    toast({
      title: "Account Deleted",
      description: "Your account has been successfully deleted."
    });
  };

  return {
    activeTab,
    setActiveTab,
    isAuthenticated,
    isProfileComplete,
    userProfile,
    notificationsEnabled,
    handleLogin,
    handleLogout,
    handleProfileSubmit,
    handleNotificationChange,
    deleteAccount
  };
};
