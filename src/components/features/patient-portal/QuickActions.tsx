
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, CreditCard, User } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

const QuickActions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} functionality will be available soon.`,
    });
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 bg-background border-b rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="inline-block w-1.5 h-5 bg-primary rounded-sm mr-1"></span>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="justify-start h-auto py-3 px-4 text-left bg-background text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-border hover:border-foreground"
          onClick={() => handleQuickAction('Book Appointment')}
        >
          <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="truncate">Book Appointment</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto py-3 px-4 text-left bg-background text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-border hover:border-foreground"
          onClick={() => handleQuickAction('Message Staff')}
        >
          <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="truncate">Message Staff</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto py-3 px-4 text-left bg-background text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-border hover:border-foreground"
          onClick={() => handleQuickAction('Make Payment')}
        >
          <CreditCard className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="truncate">Make Payment</span>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto py-3 px-4 text-left bg-background text-foreground hover:bg-foreground hover:text-background transition-all border-2 border-border hover:border-foreground"
          onClick={() => handleQuickAction('Update Info')}
        >
          <User className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="truncate">Update Info</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
