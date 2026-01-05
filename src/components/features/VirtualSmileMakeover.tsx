
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';

const VirtualSmileMakeover = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [teethWhiteness, setTeethWhiteness] = useState(0);
  const [alignmentCorrection, setAlignmentCorrection] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhitenessChange = (value: number[]) => {
    setTeethWhiteness(value[0]);
    simulateImageProcessing();
  };

  const handleAlignmentChange = (value: number[]) => {
    setAlignmentCorrection(value[0]);
    simulateImageProcessing();
  };

  const simulateImageProcessing = () => {
    // In a real implementation, this would apply actual image processing
    // Here we'll just show a loading state and then use the original image
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // In a real implementation, we would apply actual filters to the image here
      toast({
        title: "Preview Updated",
        description: "Your smile makeover preview has been updated.",
      });
    }, 1000);
  };

  const handleReset = () => {
    setTeethWhiteness(0);
    setAlignmentCorrection(0);
    setPreviewImage(selectedImage);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Virtual Smile Makeover</CardTitle>
        <CardDescription>
          Upload your photo and see how your smile could look after different dental procedures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button onClick={triggerFileInput} className="w-full">
              Upload Your Photo
            </Button>

            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label>Teeth Whitening</Label>
                <Slider 
                  defaultValue={[0]} 
                  max={100} 
                  step={1}
                  value={[teethWhiteness]}
                  onValueChange={handleWhitenessChange}
                  disabled={!selectedImage}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Natural</span>
                  <span>Brilliant White</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alignment Correction</Label>
                <Slider 
                  defaultValue={[0]} 
                  max={100} 
                  step={1}
                  value={[alignmentCorrection]}
                  onValueChange={handleAlignmentChange}
                  disabled={!selectedImage}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current</span>
                  <span>Perfectly Aligned</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="whitening" className="w-full mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="whitening">Whitening</TabsTrigger>
                <TabsTrigger value="veneers">Veneers</TabsTrigger>
                <TabsTrigger value="invisalign">Invisalign</TabsTrigger>
              </TabsList>
              <TabsContent value="whitening" className="p-4">
                Our professional whitening treatment can brighten your smile by up to 8 shades.
              </TabsContent>
              <TabsContent value="veneers" className="p-4">
                Veneers provide a complete smile transformation with thin porcelain shells.
              </TabsContent>
              <TabsContent value="invisalign" className="p-4">
                Invisalign clear aligners straighten your teeth without metal braces.
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 min-h-[300px]">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">Processing your smile makeover...</p>
              </div>
            ) : previewImage ? (
              <div className="flex flex-col items-center">
                <img 
                  src={previewImage} 
                  alt="Smile preview" 
                  className="max-h-[300px] rounded-md object-contain"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {teethWhiteness > 0 || alignmentCorrection > 0 ? 
                    "Your smile makeover preview" : 
                    "Your current smile"}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Upload a photo to see your new smile</p>
                <p className="text-sm mt-2">For best results, use a front-facing photo with a clear view of your smile</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={!selectedImage}>
          Reset
        </Button>
        <Button disabled={!selectedImage}>
          Save & Request Consultation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VirtualSmileMakeover;
