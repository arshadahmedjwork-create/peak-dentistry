
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DocumentListItem from './DocumentListItem';

interface AllDocumentsTabProps {
  documents: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    file_url?: string;
    file_type?: string;
    document_type?: string;
  }[];
  formatDate: (dateString: string) => string;
  onDownload: (documentId: string) => void;
}

const AllDocumentsTab = ({ documents, formatDate, onDownload }: AllDocumentsTabProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {documents.map((document) => (
            <DocumentListItem 
              key={document.id} 
              document={document} 
              formatDate={formatDate}
              onDownload={onDownload}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllDocumentsTab;
