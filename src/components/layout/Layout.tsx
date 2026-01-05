
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ScrollToTop } from '../ui/scroll-to-top';
import { useTheme } from '@/hooks/use-theme';
import FloatingFeaturePanel from '../ui/floating-feature/FloatingFeaturePanel';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply favicon based on theme with better transitions
    const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (faviconLink) {
      faviconLink.href = theme === 'dark' 
        ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
        : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png";
    }
    
    // Apply theme class to document with improved transitions and animations
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Enhanced data attribute for more specific CSS targeting
    document.documentElement.setAttribute('data-theme', theme);
    
    // Improved spacing and transitions on theme change
    document.body.classList.add('transition-colors', 'duration-500');
    
    // Set a smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add a custom class for enhanced theme transitions
    document.body.classList.add('theme-transition');
    
    // Enhance spacing and layout
    document.body.classList.add('overflow-x-hidden');
  }, [theme]);
  
  return (
    <div className={`flex flex-col min-h-screen ${theme} transition-all duration-500 relative`}>
      {/* Enhanced theme transition overlay */}
      <div className={`fixed inset-0 pointer-events-none z-[9999] bg-black transition-opacity duration-500 ${theme === 'dark' ? 'opacity-0' : 'opacity-0'}`}></div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        {/* Fixed Admin Portal Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link to="/admin">
            <Button 
              variant="outline" 
              className={`rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-black hover:bg-gray-900 text-white border-black'} shadow-lg`}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Portal
            </Button>
          </Link>
        </div>
        
        {/* Enhanced content wrapper for better spacing and alignment */}
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
      <FloatingFeaturePanel />
    </div>
  );
};

export default Layout;
