
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const NotFound = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
    : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png";

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-peak-gray-100">
        <div className="text-center max-w-md px-6">
          <div className="mb-8">
            <img 
              src={logoSrc} 
              alt="PEAK DENTISTRY" 
              className="h-20 mx-auto"
            />
          </div>
          <h1 className="text-6xl font-bold mb-4 text-peak-black">404</h1>
          <h2 className="text-2xl font-medium mb-6 text-peak-gray-800">Page Not Found</h2>
          <p className="text-peak-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button className="btn-primary inline-flex items-center gap-2">
              <Home size={18} />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
