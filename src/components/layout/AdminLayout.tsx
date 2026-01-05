import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-supabase-data';
import { navigationItems } from '@/config/adminNavigation';
import AdminHeader from './admin/AdminHeader';
import MobileSidebar from './admin/MobileSidebar';
import DesktopSidebar from './admin/DesktopSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hide mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };
  
  // Create admin user object from profile
  const currentAdmin = profile ? {
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Admin',
    role: 'admin',
    avatar: profile.profile_image_url,
  } : null;
  
  if (!user || !currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Navigation Bar */}
      <AdminHeader 
        currentAdmin={currentAdmin}
        handleMobileMenu={handleMobileMenu}
      />
      
      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          navigationItems={navigationItems}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />
        
        {/* Desktop Sidebar */}
        <DesktopSidebar
          currentAdmin={currentAdmin}
          navigationItems={navigationItems}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
