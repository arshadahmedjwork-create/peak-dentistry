
import React from 'react';
import { Button } from "@/components/ui/button";

const OralScanInfo = () => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">About Oral Scan Files</h3>
      <p className="text-sm text-muted-foreground mb-2">
        STL (StereoLithography) files contain 3D models of your teeth. You can view these files with any 3D model viewer software.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" className="text-xs">
          How to View STL Files
        </Button>
        <Button variant="secondary" size="sm" className="text-xs">
          Recommended Viewers
        </Button>
      </div>
    </div>
  );
};

export default OralScanInfo;
