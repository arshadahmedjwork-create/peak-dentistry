import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Download, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import STLViewer from './STLViewer';

interface DocumentItemProps {
  document: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    file_url?: string;
    file_type?: string;
    document_type?: string;
  };
  formatDate: (dateString: string) => string;
  onDownload: (documentId: string) => void;
}

const DocumentListItem = ({ document, formatDate, onDownload }: DocumentItemProps) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleViewDocument = async () => {
    console.log('[Document View] Starting preview for:', document.name);
    console.log('[Document View] File type:', document.file_type, 'Doc type:', document.document_type);
    console.log('[Document View] File URL:', document.file_url);
    
    if (!document.file_url) {
      console.error('[Document View] No file URL');
      toast({
        title: "Preview Error",
        description: "File path not found",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const bucket = document.file_type === 'stl' || document.document_type === 'scan' 
        ? 'stl-files' 
        : 'documents';
      
      console.log('[Document View] Requesting signed URL from bucket:', bucket);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(document.file_url, 600);

      console.log('[Document View] Storage response:', { success: !!data?.signedUrl, error: error?.message });

      if (error) throw error;
      
      if (data?.signedUrl) {
        console.log('[Document View] Success! Signed URL generated');
        setPreviewUrl(data.signedUrl);
      } else {
        throw new Error('No signed URL returned');
      }
    } catch (error: any) {
      console.error('[Document View] Failed:', error);
      toast({
        title: "Preview Error",
        description: error.message || "Unable to load document preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    console.log('[Document Download] Starting download for:', document.name);
    
    if (!document.file_url) {
      onDownload(document.id);
      return;
    }

    try {
      const bucket = document.file_type === 'stl' || document.document_type === 'scan' 
        ? 'stl-files' 
        : 'documents';
      
      console.log('[Document Download] Using bucket:', bucket);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(document.file_url, 60);

      console.log('[Document Download] Signed URL response:', { success: !!data?.signedUrl, error: error?.message });

      if (error) throw error;
      
      if (!data?.signedUrl) {
        throw new Error("Failed to generate download URL");
      }

      const response = await fetch(data.signedUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      const fileExtension = document.file_type || document.type?.toLowerCase() || 'pdf';
      a.download = `${document.name}.${fileExtension}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('[Document Download] Success!');
      toast({
        title: "Download Started",
        description: `${document.name} is being downloaded.`,
      });
    } catch (error: any) {
      console.error('[Document Download] Failed:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Unable to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="bg-muted p-2 rounded">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">{document.name}</p>
          <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
            <span>{formatDate(document.date)}</span>
            <span>{document.type}</span>
            <span>{document.size}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 md:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleViewDocument}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-4xl w-full">
            <SheetHeader>
              <SheetTitle>{document.name}</SheetTitle>
              <SheetDescription>
                {formatDate(document.date)} • {document.type} • {document.size}
              </SheetDescription>
            </SheetHeader>
            <div className="h-[80vh] mt-6 rounded-lg overflow-hidden bg-muted">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                </div>
              ) : previewUrl ? (
                (document.file_type === 'stl' || document.document_type === 'scan') ? (
                  <STLViewer fileUrl={previewUrl} fileName={document.name} />
                ) : (
                  <iframe 
                    src={previewUrl} 
                    className="w-full h-full border-0"
                    title={document.name}
                  />
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Document preview not available</p>
                    <Button className="mt-4" onClick={handleDownload}>
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DocumentListItem;
