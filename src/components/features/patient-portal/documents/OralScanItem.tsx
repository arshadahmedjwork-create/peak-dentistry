import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileText, Download, Box, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import STLViewer from './STLViewer';

const LoadingViewer = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-white text-sm">Loading 3D model...</p>
  </div>
);

interface OralScanItemProps {
  scan: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    preview?: string;
    file_url?: string;
  };
  formatDate: (dateString: string) => string;
  onDownload: (scanId: string, type: string) => void;
}

const OralScanItem = ({ scan, formatDate, onDownload }: OralScanItemProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const handlePreview = async () => {
    console.log('[STL Preview] Starting preview for:', scan.name, 'URL:', scan.file_url);
    
    if (!scan.file_url) {
      toast({
        title: "Error",
        description: "No file path available",
        variant: "destructive"
      });
      return;
    }

    setIsOpen(true);
    setIsLoadingUrl(true);
    
    try {
      console.log('[STL Preview] Requesting signed URL from storage...');
      
      const { data, error } = await supabase.storage
        .from('stl-files')
        .createSignedUrl(scan.file_url, 600);

      console.log('[STL Preview] Storage response:', { 
        success: !!data?.signedUrl, 
        error: error?.message 
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data?.signedUrl) {
        throw new Error('No signed URL returned');
      }

      console.log('[STL Preview] Success! URL generated');
      setSignedUrl(data.signedUrl);
    } catch (error: any) {
      console.error('[STL Preview] Failed:', error);
      toast({
        title: "Preview Failed",
        description: error.message || "Unable to load preview",
        variant: "destructive"
      });
      setIsOpen(false);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleDownloadClick = () => {
    console.log('[STL Download] Initiating download for:', scan.id);
    onDownload(scan.id, "STL");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-accent/10 p-4 rounded-lg">
      <div className="md:w-1/3 aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
        {scan.preview ? (
          <>
            <img src={scan.preview} alt={scan.name} className="object-cover w-full h-full" />
            <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-white text-xs font-bold">
              Peak Dentistry
            </div>
          </>
        ) : (
          <Box className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      <div className="md:w-2/3 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-medium">{scan.name}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {scan.type} File
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {scan.size}
            </span>
            <span>Created: {formatDate(scan.date)}</span>
          </div>
          <p className="mt-4 text-sm">
            This 3D model of your teeth can be viewed and rotated in 3D space with appropriate software.
            Download to view on your device or share with other healthcare providers.
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <Button 
            type="button"
            onClick={handleDownloadClick}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download STL File
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview 3D
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="sm:max-w-4xl w-full">
            <SheetHeader>
              <SheetTitle>3D Preview: {scan.name}</SheetTitle>
              <SheetDescription>
                Interactive 3D view of your oral scan
              </SheetDescription>
            </SheetHeader>
            <div className="h-[80vh] mt-6 rounded-lg overflow-hidden relative">
              {isLoadingUrl ? (
                <LoadingViewer />
              ) : signedUrl ? (
                <STLViewer fileUrl={signedUrl} fileName={scan.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Click Preview to load the 3D model</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default OralScanItem;
