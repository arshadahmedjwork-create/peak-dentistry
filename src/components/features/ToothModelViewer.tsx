import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { modelDescriptions } from './tooth-model/ModelDefinitions';
import Scene from './tooth-model/Scene';
import ModelControls from './tooth-model/ModelControls';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const ToothModelViewer = () => {
  const [activeTab, setActiveTab] = useState('fullMouth');
  const [showMarkers, setShowMarkers] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [showZoomAnimation, setShowZoomAnimation] = useState(false);
  
  const handleToothSelect = (toothId: string) => {
    const toothInfo = toothId.includes('molar') ? 'molar' : 
                      toothId.includes('incisor') ? 'incisor' : 
                      toothId.includes('canine') ? 'incisor' : 'molar';
    
    setPreviousTab(activeTab);
    setShowZoomAnimation(true);
    setSelectedTooth(toothId);
    
    toast({
      title: "Tooth Selected",
      description: `Viewing detailed model of ${toothId.replace('-', ' ')}`,
    });
    
    setTimeout(() => {
      setActiveTab(toothInfo);
      setShowZoomAnimation(false);
    }, 1000);
  };
  
  const handleBackToFullMouth = () => {
    setActiveTab('fullMouth');
    setSelectedTooth(null);
  };
  
  useEffect(() => {
    toast({
      title: "3D Models",
      description: "Interactive dental models loaded. Drag to rotate, scroll to zoom, click on teeth for details.",
    });
  }, []);

  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.Tooth className="mr-2 h-5 w-5" />
            Interactive Dental Model Explorer
          </CardTitle>
          <CardDescription>
            Explore different teeth types and dental structures in 3D. Rotate models by dragging, zoom with scroll wheel, and click on teeth to see detailed views.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <ModelControls 
                activeTab={activeTab}
                showMarkers={showMarkers}
                highQuality={highQuality}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setSelectedTooth(null);
                }}
                onMarkersChange={setShowMarkers}
                onQualityChange={setHighQuality}
              />
              
              {selectedTooth && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBackToFullMouth}
                  >
                    <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Full View
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="secondary" size="sm">
                              <Icons.Info className="mr-2 h-4 w-4" />
                              About This Tooth
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                {selectedTooth && selectedTooth.replace(/-/g, ' ')}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {modelDescriptions[activeTab]}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  toast({
                                    title: "Treatment Information",
                                    description: `Common treatments for ${selectedTooth?.replace(/-/g, ' ')} include fillings, crowns, and root canals.`,
                                  });
                                }}
                              >
                                <Icons.FileText className="mr-2 h-4 w-4" />
                                View Treatments
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TooltipTrigger>
                      <TooltipContent>
                        Learn more about this tooth
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            
            <div className="rounded-lg border overflow-hidden bg-gradient-to-b from-background to-muted mb-4">
              <div className="h-[400px] w-full">
                <Canvas
                  camera={{ position: [0, 0, 10], fov: 50 }}
                  dpr={highQuality ? [1, 2] : [1, 1.5]}
                  shadows={highQuality}
                  gl={{ 
                    antialias: true,
                    alpha: true
                  }}
                >
                  <Scene 
                    modelType={activeTab} 
                    showMarkers={showMarkers}
                    highQuality={highQuality}
                    selectedTooth={selectedTooth}
                    onToothSelect={handleToothSelect}
                  />
                </Canvas>
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                {selectedTooth ? 
                  `You are viewing a detailed model of ${selectedTooth.replace('-', ' ')}. ${modelDescriptions[activeTab]}` : 
                  modelDescriptions[activeTab]}
              </p>
            </div>
            
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Drag to rotate • Scroll to zoom • {activeTab === 'fullMouth' ? 'Click on a tooth for details' : 'Hover over markers for information'}</p>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/10 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Icons.Tooth className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Dental Models</DialogTitle>
                <DialogDescription>
                  Our interactive 3D models help you understand your dental anatomy and treatments.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>These models represent typical dental structures. Your actual teeth may vary. Click on teeth in the full mouth view to explore different types of teeth in detail.</p>
                <p>When viewing a specific tooth type, you can see detailed anatomical features and hovering over markers will show information about different parts of the tooth.</p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => window.location.href = '#booking-section'}>
            <Icons.Calendar className="mr-2 h-4 w-4" />
            Schedule Consultation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ToothModelViewer;
