
import React, { Suspense, lazy, useEffect } from 'react';
import { ToastWrapper } from "@/components/ui/toast-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/ui/error-boundary";
import { SkeletonCard } from "@/components/ui/skeleton-wrapper";

// Eagerly load the Index page for better initial load experience
import Index from "./pages/Index";

// Lazy load other pages for better performance
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
// Patient Portal page
const PatientPortal = lazy(() => import("./pages/PatientPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Admin Portal Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/admin/AdminForgotPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminDashboardConnected = lazy(() => import("./pages/admin/AdminDashboardConnected"));
const PatientDirectory = lazy(() => import("./pages/admin/PatientDirectory"));
const PatientDetails = lazy(() => import("./pages/admin/PatientDetailsConnected"));
const AppointmentCalendar = lazy(() => import("./pages/admin/AppointmentCalendar"));
const BillingManagement = lazy(() => import("./pages/admin/BillingManagement"));
const ReportsGenerator = lazy(() => import("./pages/admin/ReportsGenerator"));
const AdminManagement = lazy(() => import("./pages/admin/AdminManagement"));

// Patient Portal Pages
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const BookAppointment = lazy(() => import("./pages/patient/BookAppointment"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));

// Admin Settings
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Protected Route component
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Configure React Query with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const PageLoader = () => (
  <div className="container mx-auto p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

const App = () => {
  // Preload the video for the hero section
  useEffect(() => {
    const videoPreload = document.createElement('link');
    videoPreload.rel = 'preload';
    videoPreload.href = 'https://cdn.pixabay.com/vimeo/149019283/smiles-2165.mp4?width=1280&hash=eb9bca5ee21e9bfacc2506a6f54e6ecd7c63c2a7';
    videoPreload.as = 'video';
    document.head.appendChild(videoPreload);

    // Add smooth scroll behavior to HTML
    document.documentElement.style.scrollBehavior = 'smooth';

    // Preconnect to common domains
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdn.pixabay.com'].forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    return () => {
      document.head.removeChild(videoPreload);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <ToastWrapper />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Auth Routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<Signup />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Patient Portal Routes */}
                    <Route path="/patient-portal" element={<PatientPortal />} />
                    <Route path="/patient/dashboard" element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/book-appointment" element={
                      <ProtectedRoute>
                        <BookAppointment />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/profile" element={
                      <ProtectedRoute>
                        <PatientProfile />
                      </ProtectedRoute>
                    } />

                    {/* Admin Portal Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardConnected />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/manage-admins" element={
                      <ProtectedRoute requireAdmin>
                        <AdminManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/patients" element={
                      <ProtectedRoute requireAdmin>
                        <PatientDirectory />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/patients/:id" element={
                      <ProtectedRoute requireAdmin>
                        <PatientDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/appointments" element={
                      <ProtectedRoute requireAdmin>
                        <AppointmentCalendar />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/billing" element={
                      <ProtectedRoute requireAdmin>
                        <BillingManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reports" element={
                      <ProtectedRoute requireAdmin>
                        <ReportsGenerator />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedRoute requireAdmin>
                        <AdminSettings />
                      </ProtectedRoute>
                    } />

                    {/* Legal Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
