
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DesktopSidebarProps {
  currentAdmin: {
    name: string;
    role: string;
    avatar?: string;
  };
  navigationItems: Array<{
    name: string;
    icon: React.ElementType;
    path: string;
  }>;
  currentPath: string;
  onLogout: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentAdmin,
  navigationItems,
  currentPath,
  onLogout
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <aside className="hidden lg:block w-64 border-r bg-background">
      <div className="h-full flex flex-col">
        <div className="py-6 px-4">
          <div className="flex items-center space-x-2 mb-6">
            <Avatar>
              <AvatarImage src={currentAdmin.avatar} alt={currentAdmin.name} />
              <AvatarFallback>{getInitials(currentAdmin.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentAdmin.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentAdmin.role}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <nav className="space-y-1.5">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant={currentPath === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start mb-2"
            asChild
          >
            <Link to="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-500" 
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
