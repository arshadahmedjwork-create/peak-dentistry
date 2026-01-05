import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EnhancedDocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onUploadComplete?: () => void;
}

const DOCUMENT_TYPES = [
  { value: 'x-ray', label: 'X-Ray' },
  { value: 'id-proof', label: 'ID Proof' },
  { value: 'insurance', label: 'Insurance Document' },
  { value: 'medical-record', label: 'Medical Record' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'scan', label: '3D Scan (STL)' },
  { value: 'photo', label: 'Clinical Photo' },
  { value: 'report', label: 'Medical Report' },
  { value: 'other', label: 'Other' },
];

const EnhancedDocumentUpload = ({ open, onOpenChange, patientId, onUploadComplete }: EnhancedDocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [customType, setCustomType] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 20MB limit
      const MAX_FILE_SIZE = 20 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: "Files must be smaller than 20MB.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      if (!documentName) {
        setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }

      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
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

    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please specify the document type.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Sanitize filename
      const sanitizedName = documentName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileExt = file.name.split('.').pop();
      const filePath = `${patientId}/${Date.now()}_${sanitizedName}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store document record  
      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          patient_id: patientId,
          document_name: documentName,
          document_type: documentType as any, // Allow any valid type from selection
          document_type_detail: documentType === 'other' ? customType : DOCUMENT_TYPES.find(t => t.value === documentType)?.label || documentType,
          file_type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
          file_url: filePath,
          file_size_bytes: file.size,
          upload_date: new Date().toISOString().split('T')[0],
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: `Document uploaded successfully.`,
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setDocumentName('');
      setDocumentType('');
      setCustomType('');
      onOpenChange(false);
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a medical document, image, or file for this patient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.stl,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border border-white/20 rounded-xl overflow-hidden bg-white/5 p-2">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-48 w-auto mx-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {file && !preview && (
            <div className="flex items-center gap-3 p-4 border border-white/20 rounded-xl bg-white/5">
              <FileText className="h-10 w-10 text-white/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-white/60">{file.type || 'Unknown type'}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name *</Label>
            <Input
              id="documentName"
              placeholder="e.g., Dental X-Ray 2024"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type *</Label>
            <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
              <SelectTrigger>
                <SelectValue placeholder="Please specify the document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {documentType === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="customType">Specify Document Type *</Label>
              <Input
                id="customType"
                placeholder="e.g., Lab Results"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                disabled={uploading}
              />
            </div>
          )}
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
            disabled={uploading || !file || !documentName || !documentType || (documentType === 'other' && !customType)}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDocumentUpload;
