import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import STLViewer from './documents/STLViewer';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  file_url: string;
  document_type: string;
  file_type?: string;
}

interface DocumentsViewOnlyProps {
  documents: Document[];
}

const DocumentsViewOnly = ({ documents }: DocumentsViewOnlyProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'xray', label: 'X-Rays' },
    { id: 'report', label: 'Reports' },
    { id: 'prescription', label: 'Prescriptions' },
    { id: 'consent', label: 'Consent Forms' },
    { id: 'scan', label: '3D Scans' },
    { id: 'other', label: 'Other' },
  ];

  const filteredDocuments = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.document_type?.toLowerCase() === activeCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleView = async (doc: Document) => {
    console.log('=== VIEW CLICKED ===');
    console.log('Document:', doc.name, 'Type:', doc.file_type, 'DocType:', doc.document_type);
    
    setSelectedDoc(doc);
    setIsLoadingPreview(true);
    setPreviewUrl(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to view files",
          variant: "destructive"
        });
        setSelectedDoc(null);
        return;
      }

      const bucket = (doc.file_type === 'stl' || doc.document_type === 'scan') 
        ? 'stl-files' 
        : 'documents';
      
      console.log('Requesting signed URL from bucket:', bucket);
      console.log('File path:', doc.file_url);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(doc.file_url, 600);

      console.log('Storage response:', { hasSignedUrl: !!data?.signedUrl, error: error?.message });

      if (error) {
        throw error;
      }

      if (data?.signedUrl) {
        console.log('SUCCESS! Setting preview URL');
        setPreviewUrl(data.signedUrl);
      } else {
        throw new Error('No signed URL returned');
      }
    } catch (error: any) {
      console.error('View error:', error);
      toast({
        title: "View Error",
        description: error.message || "Failed to load file",
        variant: "destructive"
      });
      setSelectedDoc(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    console.log('=== DOWNLOAD CLICKED ===');
    console.log('Document:', doc.name);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to download files",
          variant: "destructive"
        });
        return;
      }

      const bucket = (doc.file_type === 'stl' || doc.document_type === 'scan') 
        ? 'stl-files' 
        : 'documents';
      
      console.log('Downloading from bucket:', bucket);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(doc.file_url, 60);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to generate download URL');
      }

      console.log('Fetching file...');
      const response = await fetch(data.signedUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = doc.file_type || doc.type?.toLowerCase() || 'pdf';
      a.download = `${doc.name}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Download success!');
      toast({
        title: "Success",
        description: "Download started"
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            View and download your dental records, x-rays, and reports
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <ScrollArea className="w-full">
          <TabsList className="w-max">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value={activeCategory} className="mt-6">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-sm text-muted-foreground">
                  No documents available in this category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="bg-[#EBEBEB] dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(doc.date)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {doc.size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => { 
        setSelectedDoc(null); 
        setPreviewUrl(null); 
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDoc?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedDoc && `${formatDate(selectedDoc.date)} • ${selectedDoc.size}`}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[70vh]">
            {isLoadingPreview ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            ) : previewUrl && selectedDoc ? (
              (selectedDoc.file_type === 'stl' || selectedDoc.document_type === 'scan') ? (
                <STLViewer fileUrl={previewUrl} fileName={selectedDoc.name} />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-full min-h-[600px]"
                  title={selectedDoc.name}
                />
              )
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Preview not available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsViewOnly;
