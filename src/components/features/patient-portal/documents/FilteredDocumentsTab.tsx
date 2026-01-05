import React from 'react';
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FilteredDocumentsTabProps {
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
  filter: (doc: any) => boolean;
}

const FilteredDocumentsTab = ({ documents, formatDate, onDownload, filter }: FilteredDocumentsTabProps) => {
  const filteredDocs = documents.filter(filter);
  
  if (filteredDocs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No documents found in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredDocs.map((doc) => (
        <Card key={doc.id} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(doc.date)}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDownload(doc.id)}
                className="shrink-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FilteredDocumentsTab;
