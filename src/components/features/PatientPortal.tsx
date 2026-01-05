import React, { Suspense, lazy, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { SkeletonCard } from "@/components/ui/skeleton-wrapper";
import ErrorBoundary from '@/components/ui/error-boundary';

// Lazy loaded components for better performance
const LoginForm = lazy(() => import('./patient-portal/LoginForm'));
const AccountHeader = lazy(() => import('./patient-portal/AccountHeader'));
const PortalTabNavigation = lazy(() => import('./patient-portal/PortalTabNavigation'));
const PortalContent = lazy(() => import('./patient-portal/PortalContent'));
const PortalFooter = lazy(() => import('./patient-portal/PortalFooter'));

// Import custom hook
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

// Import Supabase data hooks
import { 
  useAppointments,
  usePastAppointments,
  useTreatments,
  useDocuments,
  useInvoices,
  useProfile,
  useNotificationPreferences
} from '@/hooks/use-supabase-data';

// Import profile completion modal
const ProfileCompletionModal = lazy(() => import('./patient-portal/ProfileCompletionModal'));
const SettingsModal = lazy(() => import('./patient-portal/SettingsModal'));

const LoadingFallback = () => (
  <Card className="w-full">
    <CardContent className="p-6">
      <SkeletonCard numberOfLines={6} />
    </CardContent>
  </Card>
);

const PatientPortal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { appointments, loading: appointmentsLoading, refetch: refetchAppointments } = useAppointments();
  const { appointments: pastAppointments, loading: pastAppointmentsLoading } = usePastAppointments();
  const { treatments, loading: treatmentsLoading } = useTreatments();
  const { documents, loading: documentsLoading } = useDocuments();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { preferences, loading: preferencesLoading } = useNotificationPreferences();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsEnabled, setNotificationsEnabled] = useState<Record<string, boolean>>({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Convert preferences object to array format for the UI
  const notificationPreferencesArray = React.useMemo(() => {
    if (!preferences) return [];
    
    return [
      {
        id: 'appointment_reminder',
        label: 'Appointment Reminders',
        description: 'Get notified before your scheduled appointments',
        checked: preferences.appointment_reminder ?? true,
        icon: 'bell'
      },
      {
        id: 'appointment_change',
        label: 'Appointment Changes',
        description: 'Notifications about changes to your appointments',
        checked: preferences.appointment_change ?? true,
        icon: 'clock'
      },
      {
        id: 'treatment_reminders',
        label: 'Treatment Reminders',
        description: 'Reminders about upcoming treatments and care',
        checked: preferences.treatment_reminders ?? true,
        icon: 'message'
      },
      {
        id: 'billing_updates',
        label: 'Billing Updates',
        description: 'Updates about payments and invoices',
        checked: preferences.billing_updates ?? true,
        icon: 'mail'
      },
      {
        id: 'promotions',
        label: 'Promotional Offers',
        description: 'Special offers and promotions from our clinic',
        checked: preferences.promotions ?? false,
        icon: 'bell'
      }
    ];
  }, [preferences]);

  // Check if profile is incomplete
  useEffect(() => {
    if (profile && !profileLoading) {
      const isIncomplete = !profile.first_name || !profile.last_name || 
                          !profile.date_of_birth || !profile.phone || !profile.address;
      setShowProfileModal(isIncomplete);
    }
  }, [profile, profileLoading]);

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotificationsEnabled(prev => ({ ...prev, [id]: checked }));
  };

  const handleCalendlySync = () => {
    toast({
      title: "Calendly Connected",
      description: "Your appointments will now sync with Calendly.",
    });
  };

  // Show loading only for auth check
  if (authLoading) {
    return <LoadingFallback />;
  }

  // If no user, show login form
  if (!user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary>
          <LoginForm />
        </ErrorBoundary>
      </Suspense>
    );
  }

  // If user exists but profile is still loading, show loading
  if (profileLoading) {
    return <LoadingFallback />;
  }

  // If profile doesn't exist after loading, show loading (shouldn't happen normally)
  if (!profile) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <Card className="w-full animate-fade-in">
        <CardHeader className="pb-4">
          <Suspense fallback={<SkeletonCard numberOfLines={2} />}>
            <AccountHeader 
              userName={`${profile.first_name} ${profile.last_name}`}
              userEmail={profile.email || user.email || ''}
              onLogout={signOut} 
            />
          </Suspense>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <Suspense fallback={<SkeletonCard numberOfLines={1} />}>
              <PortalTabNavigation activeTab={activeTab} />
            </Suspense>
            
            <Suspense fallback={<SkeletonCard numberOfLines={6} />}>
              <ErrorBoundary>
                <PortalContent 
                  upcomingAppointments={appointments || []}
                  pastAppointments={pastAppointments || []}
                  treatmentHistory={treatments || []}
                  documents={documents || []}
                  billingHistory={invoices || []}
                  userProfile={profile}
                  onCalendlySync={handleCalendlySync}
                  onAppointmentUpdate={refetchAppointments}
                />
              </ErrorBoundary>
            </Suspense>
          </Tabs>
        </CardContent>
        <Suspense fallback={<SkeletonCard numberOfLines={1} />}>
          <PortalFooter 
            userProfile={profile}
            notificationsEnabled={notificationsEnabled}
            notificationPreferences={notificationPreferencesArray}
            onNotificationChange={handleNotificationChange}
            onProfileUpdate={() => {}}
            onLogout={signOut}
            onDeleteAccount={() => {}}
            upcomingAppointments={appointments}
          />
        </Suspense>
      </Card>

      {/* Profile Completion Modal */}
      <Suspense fallback={null}>
        <ProfileCompletionModal
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
          profile={profile}
          onComplete={refetchProfile}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default PatientPortal;
