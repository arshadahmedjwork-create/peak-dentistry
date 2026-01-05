import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { DocumentThumbnail } from './DocumentThumbnail';

// Import components
import AllDocumentsTab from './documents/AllDocumentsTab';
import OralScansTab from './documents/OralScansTab';
import FilteredDocumentsTab from './documents/FilteredDocumentsTab';

interface OralScan {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  preview?: string;
  file_url: string;
}

interface DocumentsTabProps {
  documents: any[];
}

const DocumentsTab = ({ documents }: DocumentsTabProps) => {
  const { user } = useAuth();
  const [oralScans, setOralScans] = useState<OralScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOralScans();
  }, [user]);

  const fetchOralScans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('patient_id', user.id)
        .eq('file_type', 'stl')
        .order('upload_date', { ascending: false });

      if (error) throw error;

      const scans: OralScan[] = (data || []).map(doc => ({
        id: doc.id,
        name: doc.document_name,
        type: 'STL',
        date: doc.upload_date,
        size: doc.file_size_bytes 
          ? `${(doc.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
          : 'Unknown',
        preview: "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png",
        file_url: doc.file_url
      }));

      setOralScans(scans);
    } catch (error: any) {
      console.error('Error fetching oral scans:', error);
      toast({
        title: "Error",
        description: "Failed to load oral scans.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string, documentType: string = "PDF") => {
    const document = documentType === "STL" 
      ? oralScans.find(scan => scan.id === documentId)
      : documents.find(doc => doc.id === documentId);
    
    if (!document) return;

    if (documentType === "STL" && 'file_url' in document) {
      // Download STL file using signed URL
      try {
        console.log('[Download] Starting STL download for:', document.name);
        console.log('[Download] File URL:', document.file_url);
        
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to download files",
            variant: "destructive"
          });
          return;
        }
        
        // Generate signed URL for secure download (valid for 60 seconds)
        const { data, error } = await supabase.storage
          .from('stl-files')
          .createSignedUrl(document.file_url, 60);

        if (error) {
          console.error('[Download] Storage error:', error);
          throw error;
        }
        
        if (!data?.signedUrl) {
          throw new Error("Failed to generate download URL");
        }

        console.log('[Download] Signed URL generated, fetching file...');
        // Fetch and download the file
        const response = await fetch(data.signedUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.name}.stl`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('[Download] Download completed successfully');
        toast({
          title: "Download Started",
          description: `${document.name} is being downloaded.`,
        });
      } catch (error: any) {
        console.error('[Download] Download error:', error);
        toast({
          title: "Download Failed",
          description: error.message || "Unable to download the file. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Download Started",
        description: `${document.name} is being downloaded.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Documents & Records</h2>
        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Upload Document</Button>
      </div>
      
      <Tabs defaultValue="xrays" className="w-full">
        <TabsList className="w-full md:w-auto bg-white/5">
          <TabsTrigger value="xrays" className="text-white data-[state=active]:bg-primary">X-Rays</TabsTrigger>
          <TabsTrigger value="treatment" className="text-white data-[state=active]:bg-primary">Treatment Plans</TabsTrigger>
          <TabsTrigger value="forms" className="text-white data-[state=active]:bg-primary">Forms</TabsTrigger>
          <TabsTrigger value="reports" className="text-white data-[state=active]:bg-primary">Reports</TabsTrigger>
          <TabsTrigger value="prescriptions" className="text-white data-[state=active]:bg-primary">Prescriptions</TabsTrigger>
          <TabsTrigger value="scans" className="relative text-white data-[state=active]:bg-primary">
            Oral Scans
            {oralScans.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {oralScans.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="xrays" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <FilteredDocumentsTab 
              documents={documents.filter(doc => doc.file_type !== 'stl')} 
              formatDate={formatDate} 
              onDownload={(id: string) => handleDownload(id, "PDF")} 
              filter={doc => doc.type === "X-ray"} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="treatment" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <FilteredDocumentsTab 
              documents={documents.filter(doc => doc.file_type !== 'stl')} 
              formatDate={formatDate} 
              onDownload={(id: string) => handleDownload(id, "PDF")} 
              filter={doc => doc.name.includes("Treatment")} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="forms" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <FilteredDocumentsTab 
              documents={documents.filter(doc => doc.file_type !== 'stl')} 
              formatDate={formatDate} 
              onDownload={(id: string) => handleDownload(id, "PDF")} 
              filter={doc => doc.name.includes("Form") || doc.name.includes("Receipt")} 
            />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <FilteredDocumentsTab 
              documents={documents.filter(doc => doc.file_type !== 'stl')} 
              formatDate={formatDate} 
              onDownload={(id: string) => handleDownload(id, "PDF")} 
              filter={doc => doc.name.toLowerCase().includes("report")} 
            />
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <FilteredDocumentsTab 
              documents={documents.filter(doc => doc.file_type !== 'stl')} 
              formatDate={formatDate} 
              onDownload={(id: string) => handleDownload(id, "PDF")} 
              filter={doc => doc.name.toLowerCase().includes("prescription")} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="scans" className="mt-6">
          <div className="bg-[#EBEBEB] rounded-lg p-6 min-h-[300px]">
            <OralScansTab 
              oralScans={oralScans} 
              formatDate={formatDate} 
              onDownload={handleDownload} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsTab;
