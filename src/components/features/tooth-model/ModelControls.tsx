
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModelControlsProps {
  activeTab: string;
  showMarkers: boolean;
  highQuality: boolean;
  onTabChange: (value: string) => void;
  onMarkersChange: (value: boolean) => void;
  onQualityChange: (value: boolean) => void;
}

const ModelControls: React.FC<ModelControlsProps> = ({ 
  activeTab, 
  showMarkers, 
  highQuality, 
  onTabChange, 
  onMarkersChange, 
  onQualityChange 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="fullMouth" onClick={() => onTabChange('fullMouth')}>Full Mouth</TabsTrigger>
        <TabsTrigger value="molar" onClick={() => onTabChange('molar')}>Molar</TabsTrigger>
        <TabsTrigger value="incisor" onClick={() => onTabChange('incisor')}>Incisor</TabsTrigger>
        <TabsTrigger value="implant" onClick={() => onTabChange('implant')}>Implant</TabsTrigger>
      </TabsList>
      
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-markers" className="text-xs">Markers</Label>
          <Switch
            id="show-markers"
            checked={showMarkers}
            onCheckedChange={onMarkersChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="high-quality" className="text-xs">HD</Label>
          <Switch
            id="high-quality"
            checked={highQuality}
            onCheckedChange={onQualityChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelControls;
