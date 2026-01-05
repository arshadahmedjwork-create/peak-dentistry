
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import OralScanInfo from './OralScanInfo';
import { STLDocumentViewer } from './STLDocumentViewer';

interface OralScansTabProps {
  oralScans: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    preview?: string;
    file_url?: string;
  }[];
  formatDate: (dateString: string) => string;
  onDownload: (scanId: string, type: string) => void;
}

const OralScansTab = ({ oralScans, formatDate, onDownload }: OralScansTabProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <OralScanInfo />

          {oralScans.map((scan) => (
            <div key={scan.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{scan.name}</p>
                  <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{formatDate(scan.date)}</span>
                    <span>{scan.type}</span>
                    <span>{scan.size}</span>
                  </div>
                </div>
              </div>
              <STLDocumentViewer
                document={{
                  id: scan.id,
                  name: scan.name,
                  file_url: scan.file_url || '',
                  date: scan.date,
                  size: scan.size
                }}
                formatDate={formatDate}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OralScansTab;
