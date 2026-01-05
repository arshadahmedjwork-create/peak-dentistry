import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface STLUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onUploadComplete?: () => void;
}

const STLUploadDialog = ({ open, onOpenChange, patientId, onUploadComplete }: STLUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [notes, setNotes] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith('.stl')) {
        setFile(selectedFile);
        if (!documentName) {
          setDocumentName(selectedFile.name.replace('.stl', ''));
        }
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an STL file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !documentName) {
      toast({
        title: "Missing Information",
        description: "Please provide a file and document name.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "STL files must be smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file content is actually STL format
    try {
      const buffer = await file.arrayBuffer();
      const header = new TextDecoder().decode(buffer.slice(0, 5));
      const isBinarySTL = buffer.byteLength > 84; // Binary STL minimum size
      
      // Check for ASCII STL (starts with "solid") or Binary STL format
      if (header !== 'solid' && !isBinarySTL) {
        toast({
          title: "Invalid File Format",
          description: "File does not appear to be a valid STL file.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to validate file format.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Sanitize filename to prevent path traversal
      const sanitizedName = documentName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileExt = 'stl';
      const filePath = `${patientId}/${Date.now()}_${sanitizedName}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('stl-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store the file path (not URL) for later signed URL generation
      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          patient_id: patientId,
          document_name: documentName,
          document_type: 'scan',
          file_type: 'stl',
          file_url: filePath, // Store path instead of public URL
          file_size_bytes: file.size,
          upload_date: new Date().toISOString().split('T')[0],
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "STL file uploaded successfully.",
      });

      // Reset form
      setFile(null);
      setDocumentName('');
      setNotes('');
      onOpenChange(false);
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload STL File</DialogTitle>
          <DialogDescription>
            Upload a 3D scan file for this patient. Only STL files are supported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">STL File *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".stl"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {file && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name *</Label>
            <Input
              id="documentName"
              placeholder="e.g., Full Mouth Scan"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this scan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={uploading}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !documentName}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default STLUploadDialog;
