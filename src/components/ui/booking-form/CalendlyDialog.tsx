
import React, { useState } from 'react';
import { LinkIcon, Calendar, CheckCircle, Loader2, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface CalendlyDialogProps {
  onConnect: () => void;
}

const CalendlyDialog = ({ onConnect }: CalendlyDialogProps) => {
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [open, setOpen] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [testMode, setTestMode] = useState(false);

  const validateUrl = (url: string) => {
    // Empty URLs are considered valid but won't allow connection
    if (!url) return true;
    
    const isCalendlyUrl = url.includes('calendly.com/');
    setIsValid(isCalendlyUrl);
    return isCalendlyUrl;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCalendlyUrl(url);
    validateUrl(url);
  };

  const handleConnect = () => {
    if (!calendlyUrl || !isValid) return;
    
    setIsConnecting(true);
    setConnectionProgress(0);
    
    // Simulate API connection with progress
    const interval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);
    
    // Simulate completion
    setTimeout(() => {
      setIsConnecting(false);
      clearInterval(interval);
      setConnectionProgress(100);
      
      // If in test mode, toggle between success and failure for demo purposes
      if (testMode) {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to Calendly. Please try again or contact support.",
        });
      } else {
        onConnect();
        toast({
          title: "Calendly Connected",
          description: "Your booking system is now synced with Calendly.",
        });
        setTimeout(() => setOpen(false), 1000);
      }
    }, 3000);
  };

  const handleTestModeToggle = () => {
    setTestMode(!testMode);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center transition-colors hover:bg-peak-gray-200">
          <LinkIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">Calendly</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Connect with Calendly
          </DialogTitle>
          <DialogDescription>
            Link your Calendly account to automate appointment scheduling and sync with your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md bg-muted p-4 mb-4">
            <p className="text-sm">
              Connecting with Calendly allows you to:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Display real-time availability</li>
              <li>Automate appointment scheduling</li>
              <li>Send automatic reminders</li>
              <li>Reduce no-shows</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="calendlyUrl" className="text-sm font-medium">
                Your Calendly URL
              </label>
              <div className="relative">
                <Input
                  id="calendlyUrl"
                  placeholder="https://calendly.com/yourusername"
                  value={calendlyUrl}
                  onChange={handleUrlChange}
                  className={`pr-10 ${!isValid && calendlyUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isConnecting}
                />
                {calendlyUrl && isValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                )}
                {calendlyUrl && !isValid && (
                  <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                )}
              </div>
              {!isValid && calendlyUrl && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Please enter a valid Calendly URL (https://calendly.com/...)
                </p>
              )}
            </div>
            
            {isConnecting && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Connecting...</span>
                  <span className="text-sm font-medium">{connectionProgress}%</span>
                </div>
                <Progress value={connectionProgress} className="h-2" />
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleConnect} 
              disabled={!calendlyUrl || !isValid || isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Account"
              )}
            </Button>
            
            <div className="pt-2 text-xs text-center text-muted-foreground">
              Don't have a Calendly account?{" "}
              <a 
                href="https://calendly.com/signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sign up for free
              </a>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleTestModeToggle}
            className="text-xs"
          >
            {testMode ? "Disable Test Mode" : "Enable Test Mode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyDialog;
