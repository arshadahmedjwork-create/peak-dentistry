import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, FileArchive, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentThumbnailProps {
  document: {
    id: string;
    document_name: string;
    document_type: string;
    file_type: string;
    file_url: string;
    upload_date: string;
    file_size_bytes?: number;
  };
  onClick?: () => void;
}

export const DocumentThumbnail: React.FC<DocumentThumbnailProps> = ({ document, onClick }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    // Generate thumbnail for images
    if (document.file_type === 'image' || document.file_type === 'stl') {
      generateThumbnail();
    }
  }, [document.file_url]);

  const generateThumbnail = async () => {
    try {
      const { data } = await supabase.storage
        .from(document.file_type === 'stl' ? 'stl-files' : 'documents')
        .createSignedUrl(document.file_url, 3600);

      if (data?.signedUrl && document.file_type === 'image') {
        setThumbnail(data.signedUrl);
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const getIcon = () => {
    switch (document.file_type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-white/60" />;
      case 'stl':
        return <FileArchive className="h-8 w-8 text-white/60" />;
      default:
        return <FileText className="h-8 w-8 text-white/60" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card 
      className="bg-white/5 border-white/10 backdrop-blur-sm hover-lift cursor-pointer transition-all duration-300 overflow-hidden group"
      onClick={onClick}
    >
      <div className="aspect-square relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={document.document_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            {getIcon()}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
            {formatType(document.document_type)}
          </Badge>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h4 className="font-medium text-white text-sm truncate">{document.document_name}</h4>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{new Date(document.upload_date).toLocaleDateString()}</span>
          {document.file_size_bytes && (
            <span>{formatFileSize(document.file_size_bytes)}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
