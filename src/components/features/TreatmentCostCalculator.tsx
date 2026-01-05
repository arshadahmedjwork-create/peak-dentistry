
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, DollarSign, ShieldCheck, Calculator, Info } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface TreatmentOption {
  id: string;
  name: string;
  basePrice: number;
  options?: {
    id: string;
    name: string;
    priceAdjustment: number;
  }[];
  complexity?: {
    low: number;
    medium: number;
    high: number;
  };
  insuranceCoverage?: {
    basic: number;
    standard: number;
    premium: number;
    none: number;
  };
}

const treatments: TreatmentOption[] = [
  {
    id: "cleaning",
    name: "Dental Cleaning & Check-up",
    basePrice: 120,
    options: [
      { id: "standard", name: "Standard Cleaning", priceAdjustment: 0 },
      { id: "deep", name: "Deep Cleaning", priceAdjustment: 100 }
    ],
    complexity: {
      low: 0,
      medium: 0,
      high: 0
    },
    insuranceCoverage: {
      basic: 0.8,
      standard: 0.9,
      premium: 1.0,
      none: 0
    }
  },
  {
    id: "filling",
    name: "Dental Filling",
    basePrice: 150,
    options: [
      { id: "amalgam", name: "Amalgam (Silver)", priceAdjustment: 0 },
      { id: "composite", name: "Composite (Tooth-colored)", priceAdjustment: 50 }
    ],
    complexity: {
      low: 0,
      medium: 50,
      high: 100
    },
    insuranceCoverage: {
      basic: 0.7,
      standard: 0.8,
      premium: 0.9,
      none: 0
    }
  },
  {
    id: "crown",
    name: "Dental Crown",
    basePrice: 1000,
    options: [
      { id: "porcelain-fused", name: "Porcelain-Fused-to-Metal", priceAdjustment: 0 },
      { id: "all-ceramic", name: "All-Ceramic", priceAdjustment: 200 },
      { id: "zirconia", name: "Zirconia", priceAdjustment: 300 }
    ],
    complexity: {
      low: 0,
      medium: 200,
      high: 400
    },
    insuranceCoverage: {
      basic: 0.5,
      standard: 0.6,
      premium: 0.7,
      none: 0
    }
  },
  {
    id: "rootcanal",
    name: "Root Canal Treatment",
    basePrice: 800,
    options: [],
    complexity: {
      low: 0,
      medium: 200,
      high: 400
    },
    insuranceCoverage: {
      basic: 0.7,
      standard: 0.8,
      premium: 0.9,
      none: 0
    }
  },
  {
    id: "extraction",
    name: "Tooth Extraction",
    basePrice: 150,
    options: [
      { id: "simple", name: "Simple Extraction", priceAdjustment: 0 },
      { id: "surgical", name: "Surgical Extraction", priceAdjustment: 200 }
    ],
    complexity: {
      low: 0,
      medium: 100,
      high: 250
    },
    insuranceCoverage: {
      basic: 0.7,
      standard: 0.8,
      premium: 0.9,
      none: 0
    }
  },
  {
    id: "implant",
    name: "Dental Implant",
    basePrice: 3000,
    options: [
      { id: "titanium", name: "Titanium Implant", priceAdjustment: 0 },
      { id: "ceramic", name: "Ceramic Implant", priceAdjustment: 500 }
    ],
    complexity: {
      low: 0,
      medium: 500,
      high: 1000
    },
    insuranceCoverage: {
      basic: 0.3,
      standard: 0.5,
      premium: 0.6,
      none: 0
    }
  },
  {
    id: "veneer",
    name: "Porcelain Veneer",
    basePrice: 1200,
    options: [
      { id: "standard", name: "Standard Porcelain", priceAdjustment: 0 },
      { id: "premium", name: "Premium Porcelain", priceAdjustment: 300 }
    ],
    complexity: {
      low: 0,
      medium: 200,
      high: 400
    },
    insuranceCoverage: {
      basic: 0,
      standard: 0.3,
      premium: 0.5,
      none: 0
    }
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    basePrice: 300,
    options: [
      { id: "in-office", name: "In-Office Whitening", priceAdjustment: 0 },
      { id: "take-home", name: "Take-Home Kit", priceAdjustment: -100 }
    ],
    complexity: {
      low: 0,
      medium: 0,
      high: 0
    },
    insuranceCoverage: {
      basic: 0,
      standard: 0,
      premium: 0.3,
      none: 0
    }
  },
  {
    id: "invisalign",
    name: "Invisalign Treatment",
    basePrice: 5000,
    options: [
      { id: "lite", name: "Invisalign Lite (Minor Corrections)", priceAdjustment: -1500 },
      { id: "full", name: "Invisalign Full", priceAdjustment: 0 }
    ],
    complexity: {
      low: -500,
      medium: 0,
      high: 1000
    },
    insuranceCoverage: {
      basic: 0,
      standard: 0.3,
      premium: 0.5,
      none: 0
    }
  }
];

const insuranceProviders = [
  { id: "none", name: "No Insurance / Self-Pay" },
  { id: "aetna", name: "Aetna" },
  { id: "cigna", name: "Cigna" },
  { id: "delta", name: "Delta Dental" },
  { id: "metlife", name: "MetLife" },
  { id: "unitedhealth", name: "UnitedHealthcare" }
];

const TreatmentCostCalculator = () => {
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [treatmentOption, setTreatmentOption] = useState<string | null>(null);
  const [complexity, setComplexity] = useState("medium");
  const [quantity, setQuantity] = useState(1);
  const [insuranceProvider, setInsuranceProvider] = useState("none");
  const [insurancePlan, setInsurancePlan] = useState("none");
  const [hasInsurance, setHasInsurance] = useState(false);
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const [outOfPocketCost, setOutOfPocketCost] = useState<number | null>(null);
  const [baseCost, setBaseCost] = useState<number | null>(null);
  
  const selectedTreatmentData = selectedTreatment 
    ? treatments.find(t => t.id === selectedTreatment) 
    : null;

  useEffect(() => {
    if (selectedTreatment) {
      // Reset option when treatment changes
      setTreatmentOption(null);
      calculateCost();
    }
  }, [selectedTreatment]);

  useEffect(() => {
    calculateCost();
  }, [treatmentOption, complexity, quantity, insurancePlan, hasInsurance]);

  const calculateCost = () => {
    if (!selectedTreatmentData) {
      setFinalEstimate(null);
      setOutOfPocketCost(null);
      setBaseCost(null);
      return;
    }

    // Base price
    let cost = selectedTreatmentData.basePrice;
    setBaseCost(cost);

    // Add option cost if selected
    if (treatmentOption && selectedTreatmentData.options?.length) {
      const option = selectedTreatmentData.options.find(opt => opt.id === treatmentOption);
      if (option) {
        cost += option.priceAdjustment;
      }
    }

    // Add complexity cost
    if (selectedTreatmentData.complexity) {
      cost += selectedTreatmentData.complexity[complexity as keyof typeof selectedTreatmentData.complexity] || 0;
    }

    // Multiply by quantity
    cost = cost * quantity;
    setFinalEstimate(cost);

    // Calculate insurance coverage
    if (hasInsurance && selectedTreatmentData.insuranceCoverage) {
      const coverage = selectedTreatmentData.insuranceCoverage[insurancePlan as keyof typeof selectedTreatmentData.insuranceCoverage] || 0;
      const coveredAmount = cost * coverage;
      setOutOfPocketCost(cost - coveredAmount);
    } else {
      setOutOfPocketCost(cost);
    }
  };

  const handleTreatmentChange = (value: string) => {
    setSelectedTreatment(value);
  };

  const handleOptionChange = (value: string) => {
    setTreatmentOption(value);
  };

  const handleComplexityChange = (value: string) => {
    setComplexity(value);
  };

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value);
    if (!isNaN(qty) && qty > 0 && qty <= 10) {
      setQuantity(qty);
    }
  };

  const handleInsuranceToggle = (checked: boolean) => {
    setHasInsurance(checked);
    if (!checked) {
      setInsurancePlan("none");
    } else {
      setInsurancePlan("standard");
    }
  };

  const handleInsuranceProviderChange = (value: string) => {
    setInsuranceProvider(value);
  };

  const handleInsurancePlanChange = (value: string) => {
    setInsurancePlan(value);
  };

  const handleSubmitRequest = () => {
    toast({
      title: "Estimate Request Submitted",
      description: "A detailed cost breakdown will be sent to your email.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Dental Treatment Cost Calculator
        </CardTitle>
        <CardDescription>
          Get an estimate for common dental procedures based on your specific needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
            <TabsTrigger value="info">Treatment Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Type</Label>
                  <Select value={selectedTreatment || ""} onValueChange={handleTreatmentChange}>
                    <SelectTrigger id="treatment">
                      <SelectValue placeholder="Select a treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatments.map((treatment) => (
                        <SelectItem key={treatment.id} value={treatment.id}>
                          {treatment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedTreatmentData && selectedTreatmentData.options && selectedTreatmentData.options.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="option">Treatment Option</Label>
                    <Select value={treatmentOption || ""} onValueChange={handleOptionChange}>
                      <SelectTrigger id="option">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTreatmentData.options.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} {option.priceAdjustment !== 0 && 
                              `(${option.priceAdjustment > 0 ? '+' : ''}$${option.priceAdjustment})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedTreatmentData && selectedTreatmentData.complexity && (
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Case Complexity</Label>
                    <Select value={complexity} onValueChange={handleComplexityChange}>
                      <SelectTrigger id="complexity">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Complexity</SelectItem>
                        <SelectItem value="medium">Medium Complexity</SelectItem>
                        <SelectItem value="high">High Complexity</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Case complexity is determined during your consultation based on your specific situation.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (number of teeth)</Label>
                  <Select value={quantity.toString()} onValueChange={handleQuantityChange}>
                    <SelectTrigger id="quantity">
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="insurance" 
                    checked={hasInsurance}
                    onCheckedChange={handleInsuranceToggle}
                  />
                  <Label htmlFor="insurance" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    I have dental insurance
                  </Label>
                </div>
                
                {hasInsurance && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="insurance-provider">Insurance Provider</Label>
                      <Select value={insuranceProvider} onValueChange={handleInsuranceProviderChange}>
                        <SelectTrigger id="insurance-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insurance-plan">Insurance Plan Level</Label>
                      <Select value={insurancePlan} onValueChange={handleInsurancePlanChange}>
                        <SelectTrigger id="insurance-plan">
                          <SelectValue placeholder="Select plan level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None / Not Covered</SelectItem>
                          <SelectItem value="basic">Basic Plan</SelectItem>
                          <SelectItem value="standard">Standard Plan</SelectItem>
                          <SelectItem value="premium">Premium Plan</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        This is an estimate. Actual coverage depends on your specific plan details.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />
            
            {finalEstimate !== null && (
              <div className="rounded-lg border p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Treatment Summary</h3>
                    <p className="mt-2">{selectedTreatmentData?.name}</p>
                    {treatmentOption && selectedTreatmentData?.options && (
                      <p className="text-sm">
                        Option: {selectedTreatmentData.options.find(o => o.id === treatmentOption)?.name}
                      </p>
                    )}
                    <p className="text-sm">Complexity: {complexity.charAt(0).toUpperCase() + complexity.slice(1)}</p>
                    <p className="text-sm">Quantity: {quantity}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Cost Breakdown</h3>
                    <p className="mt-2">Base Cost: ${baseCost?.toFixed(2)}</p>
                    <p className="text-sm">Total Estimate: ${finalEstimate.toFixed(2)}</p>
                    {hasInsurance && (
                      <>
                        <p className="text-sm">Insurance Coverage: ${(finalEstimate - (outOfPocketCost || 0)).toFixed(2)}</p>
                        <p className="font-medium">Your Estimated Cost: ${outOfPocketCost?.toFixed(2)}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    This is an estimate only. Actual costs may vary based on your specific dental condition, which can only be determined during an in-person examination.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <p className="text-sm text-muted-foreground">
                For a personalized estimate, please schedule a consultation.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.print()}>
                  Print Estimate
                </Button>
                <Button onClick={handleSubmitRequest} disabled={!finalEstimate}>
                  Request Detailed Quote
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {treatments.map((treatment) => (
                <Card key={treatment.id} className="overflow-hidden">
                  <CardHeader className="bg-muted pb-2">
                    <CardTitle className="text-lg">{treatment.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-3">{getTreatmentDescription(treatment.id)}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Starting from</span>
                      <span className="font-semibold">${treatment.basePrice}</span>
                    </div>
                    {treatment.options && treatment.options.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1">Available Options:</p>
                        <ul className="text-xs space-y-1">
                          {treatment.options.map((option) => (
                            <li key={option.id} className="flex justify-between">
                              <span>{option.name}</span>
                              {option.priceAdjustment !== 0 && (
                                <span className={option.priceAdjustment > 0 ? "text-red-500" : "text-green-500"}>
                                  {option.priceAdjustment > 0 ? "+" : ""}{option.priceAdjustment}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Understanding Dental Costs</p>
                  <p className="mt-1 text-muted-foreground">
                    Dental treatment costs vary based on several factors including the complexity of your case, 
                    materials used, and your location. Insurance coverage also varies significantly between providers and plans.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    For the most accurate cost information, we recommend scheduling a consultation 
                    where we can evaluate your specific needs and provide a detailed treatment plan.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function for treatment descriptions
function getTreatmentDescription(treatmentId: string): string {
  switch (treatmentId) {
    case "cleaning":
      return "Professional cleaning removes plaque and tartar buildup, helping prevent cavities and gum disease. Includes examination and assessment.";
    case "filling":
      return "Dental fillings restore teeth damaged by decay. We offer both traditional amalgam and natural-looking tooth-colored composite fillings.";
    case "crown":
      return "A dental crown is a cap that covers a damaged tooth to restore its shape, size, strength, and appearance.";
    case "rootcanal":
      return "Root canal treatment removes infected pulp from inside the tooth, relieving pain and saving the natural tooth from extraction.";
    case "extraction":
      return "Tooth extraction removes a tooth that cannot be saved due to damage, decay, or for orthodontic purposes.";
    case "implant":
      return "Dental implants are titanium posts surgically placed into the jawbone to support replacement teeth, providing a permanent solution for missing teeth.";
    case "veneer":
      return "Porcelain veneers are thin shells bonded to the front of teeth to improve appearance, addressing issues like discoloration, chips, or gaps.";
    case "whitening":
      return "Professional teeth whitening brightens your smile by several shades, removing stains and discoloration caused by food, drinks, or aging.";
    case "invisalign":
      return "Invisalign uses clear, removable aligners to gradually straighten teeth without the visibility and restrictions of traditional braces.";
    default:
      return "Contact us for more information about this treatment.";
  }
}

export default TreatmentCostCalculator;
