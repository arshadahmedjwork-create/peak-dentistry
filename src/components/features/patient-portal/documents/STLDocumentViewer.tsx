import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import STLViewer from './STLViewer';

interface STLDocumentViewerProps {
  document: {
    id: string;
    name: string;
    file_url: string;
    date: string;
    size: string;
  };
  formatDate: (date: string) => string;
}

export const STLDocumentViewer = ({ document, formatDate }: STLDocumentViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    console.log('=== STL VIEW CLICKED ===');
    console.log('File:', document.name);
    console.log('Path:', document.file_url);
    
    setLoading(true);
    setIsOpen(true);

    try {
      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to view files",
          variant: "destructive"
        });
        setIsOpen(false);
        setLoading(false);
        return;
      }

      console.log('Requesting signed URL from bucket: stl-files');
      console.log('File path:', document.file_url);
      
      const { data, error } = await supabase.storage
        .from('stl-files')
        .createSignedUrl(document.file_url, 600);

      console.log('Storage API response:', { 
        hasData: !!data, 
        hasSignedUrl: !!data?.signedUrl,
        error: error 
      });

      if (error) {
        console.error('Storage error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        toast({
          title: "Storage Error",
          description: `Failed to load file: ${error.message}`,
          variant: "destructive"
        });
        setIsOpen(false);
        return;
      }

      if (data?.signedUrl) {
        console.log('SUCCESS! Signed URL obtained');
        console.log('URL preview:', data.signedUrl.substring(0, 100) + '...');
        setSignedUrl(data.signedUrl);
      } else {
        console.error('No signed URL in response');
        toast({
          title: "Error",
          description: "Failed to generate file URL",
          variant: "destructive"
        });
        setIsOpen(false);
      }
    } catch (err: any) {
      console.error('Unexpected error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      toast({
        title: "Error",
        description: err.message || "Failed to load file",
        variant: "destructive"
      });
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    console.log('=== STL DOWNLOAD CLICKED ===');
    console.log('File:', document.name);
    console.log('Path:', document.file_url);
    
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to download files",
          variant: "destructive"
        });
        return;
      }

      console.log('Requesting signed URL for download...');
      const { data, error } = await supabase.storage
        .from('stl-files')
        .createSignedUrl(document.file_url, 60);

      console.log('Download URL response:', { hasData: !!data, error });

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to generate download URL');
      }

      console.log('Fetching file from signed URL...');
      const response = await fetch(data.signedUrl);
      console.log('Fetch response:', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }
      
      console.log('Creating download blob...');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.name}.stl`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
      toast({ title: "Success", description: "Download started" });
    } catch (err: any) {
      console.error('Download error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      toast({
        title: "Download Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleView}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>{document.name}</DialogTitle>
            <DialogDescription>
              {formatDate(document.date)} • {document.size}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : signedUrl ? (
              <STLViewer fileUrl={signedUrl} fileName={document.name} />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};