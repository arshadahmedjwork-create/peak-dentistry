import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, PhoneCall, Clock, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface EmergencyStep {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    action: "next" | "result";
    target: string;
  }[];
}

interface EmergencyResult {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  description: string;
  instructions: string[];
  seekHelp: "immediate" | "24hours" | "schedule";
}

const emergencySteps: EmergencyStep[] = [
  {
    id: "start",
    question: "What dental issue are you experiencing?",
    options: [
      { id: "pain", text: "Tooth or mouth pain", action: "next", target: "pain-level" },
      { id: "trauma", text: "Injury or trauma to mouth/teeth", action: "next", target: "trauma-type" },
      { id: "bleeding", text: "Bleeding gums", action: "next", target: "bleeding-severity" },
      { id: "swelling", text: "Swelling in mouth or face", action: "next", target: "swelling-location" },
      { id: "broken", text: "Broken/chipped tooth or restoration", action: "next", target: "broken-severity" },
    ]
  },
  {
    id: "pain-level",
    question: "How would you describe the pain?",
    options: [
      { id: "severe", text: "Severe, unbearable pain", action: "result", target: "severe-pain" },
      { id: "moderate", text: "Moderate pain that comes and goes", action: "next", target: "pain-duration" },
      { id: "mild", text: "Mild discomfort", action: "result", target: "mild-pain" },
      { id: "sensitive", text: "Sensitivity to hot, cold, or sweet", action: "result", target: "sensitivity" }
    ]
  },
  {
    id: "pain-duration",
    question: "How long have you been experiencing this pain?",
    options: [
      { id: "recent", text: "Just started (last 24 hours)", action: "result", target: "recent-moderate-pain" },
      { id: "days", text: "Several days", action: "result", target: "persistent-moderate-pain" },
      { id: "weeks", text: "Weeks or longer", action: "result", target: "chronic-pain" }
    ]
  },
  {
    id: "trauma-type",
    question: "What type of trauma occurred?",
    options: [
      { id: "knocked-out", text: "Tooth knocked out completely", action: "result", target: "knocked-out-tooth" },
      { id: "loose", text: "Tooth is loose or pushed out of position", action: "result", target: "loose-tooth" },
      { id: "broken-tooth", text: "Broken or fractured tooth", action: "next", target: "broken-tooth-pain" },
      { id: "lip-injury", text: "Cut or injury to lips, tongue, or inside of mouth", action: "result", target: "soft-tissue-injury" }
    ]
  },
  {
    id: "broken-tooth-pain",
    question: "Is the broken tooth causing pain?",
    options: [
      { id: "yes-severe", text: "Yes, severe pain", action: "result", target: "broken-tooth-severe" },
      { id: "yes-mild", text: "Yes, mild to moderate pain", action: "result", target: "broken-tooth-mild" },
      { id: "no", text: "No pain, but sharp edges", action: "result", target: "broken-tooth-no-pain" }
    ]
  },
  {
    id: "bleeding-severity",
    question: "How severe is the bleeding?",
    options: [
      { id: "heavy", text: "Heavy, continuous bleeding", action: "result", target: "heavy-bleeding" },
      { id: "moderate", text: "Moderate bleeding when brushing/flossing", action: "result", target: "moderate-bleeding" },
      { id: "minor", text: "Minor, occasional bleeding", action: "result", target: "minor-bleeding" }
    ]
  },
  {
    id: "swelling-location",
    question: "Where is the swelling located?",
    options: [
      { id: "face", text: "Face or jaw", action: "next", target: "swelling-severity" },
      { id: "gums", text: "Gums around a tooth", action: "next", target: "swelling-pain" }
    ]
  },
  {
    id: "swelling-severity",
    question: "How severe is the swelling?",
    options: [
      { id: "severe", text: "Severe swelling affecting breathing or swallowing", action: "result", target: "severe-swelling" },
      { id: "moderate", text: "Moderate to severe, but no breathing issues", action: "result", target: "moderate-swelling" },
      { id: "mild", text: "Mild swelling", action: "result", target: "mild-swelling" }
    ]
  },
  {
    id: "swelling-pain",
    question: "Is there pain with the swelling?",
    options: [
      { id: "yes-severe", text: "Yes, severe pain", action: "result", target: "gum-abscess-severe" },
      { id: "yes-mild", text: "Yes, mild to moderate pain", action: "result", target: "gum-abscess-mild" },
      { id: "no", text: "No significant pain", action: "result", target: "gum-swelling-no-pain" }
    ]
  },
  {
    id: "broken-severity",
    question: "What is broken or damaged?",
    options: [
      { id: "crown", text: "Crown or filling fell out", action: "result", target: "lost-restoration" },
      { id: "veneer", text: "Veneer or bonding damaged", action: "result", target: "cosmetic-damage" },
      { id: "denture", text: "Denture or partial denture broken", action: "result", target: "broken-denture" },
      { id: "braces", text: "Issue with braces or orthodontic appliance", action: "result", target: "orthodontic-issue" }
    ]
  }
];

const emergencyResults: EmergencyResult[] = [
  {
    id: "severe-pain",
    title: "Severe Dental Pain",
    severity: "high",
    description: "Severe dental pain can indicate an infection, abscess, or serious dental condition that requires prompt attention.",
    instructions: [
      "Take over-the-counter pain medication as directed (if not contraindicated for your health).",
      "Apply a cold compress to the outside of your cheek for 20 minutes at a time.",
      "Do not place aspirin directly on the gums or tooth as it can burn the tissue.",
      "Rinse with warm salt water to help reduce inflammation.",
      "Avoid very hot, cold, or sweet foods and beverages."
    ],
    seekHelp: "immediate"
  },
  {
    id: "recent-moderate-pain",
    title: "Recent Moderate Dental Pain",
    severity: "medium",
    description: "Moderate dental pain of recent onset could indicate a developing cavity, infection, or gum issue.",
    instructions: [
      "Take over-the-counter pain relievers as directed.",
      "Rinse with warm salt water several times a day.",
      "Avoid chewing on the affected side.",
      "Apply clove oil to the affected area for temporary relief.",
      "Avoid very hot, cold, or sweet foods and beverages."
    ],
    seekHelp: "24hours"
  },
  {
    id: "persistent-moderate-pain",
    title: "Persistent Moderate Dental Pain",
    severity: "medium",
    description: "Persistent moderate pain could indicate an infection, a cracked tooth, or other issues requiring treatment.",
    instructions: [
      "Take over-the-counter pain relievers as directed.",
      "Apply a cold compress to the outside of your face.",
      "Rinse with warm salt water several times a day.",
      "Avoid chewing on the affected side.",
      "Continue regular gentle brushing and flossing."
    ],
    seekHelp: "24hours"
  },
  {
    id: "chronic-pain",
    title: "Chronic Dental Pain",
    severity: "medium",
    description: "Long-term dental pain may indicate grinding/clenching, a bite issue, or untreated dental problems.",
    instructions: [
      "Take over-the-counter pain relievers as directed.",
      "Apply warm compresses to the jaw muscles.",
      "Avoid hard, chewy foods.",
      "Be aware of clenching or grinding and try to relax your jaw muscles.",
      "Maintain good oral hygiene."
    ],
    seekHelp: "schedule"
  },
  {
    id: "mild-pain",
    title: "Mild Dental Discomfort",
    severity: "low",
    description: "Mild discomfort could be caused by minor issues like early decay, mild gum inflammation, or minor tooth sensitivity.",
    instructions: [
      "Maintain good oral hygiene with gentle brushing and flossing.",
      "Use a toothpaste designed for sensitive teeth.",
      "Rinse with warm salt water.",
      "Avoid foods and beverages that trigger discomfort.",
      "Take over-the-counter pain relievers if needed."
    ],
    seekHelp: "schedule"
  },
  {
    id: "sensitivity",
    title: "Tooth Sensitivity",
    severity: "low",
    description: "Sensitivity to temperature or sweet foods can indicate enamel wear, gum recession, or early decay.",
    instructions: [
      "Use desensitizing toothpaste (brush with it and leave a small amount on the sensitive area).",
      "Use a soft-bristled toothbrush and gentle brushing technique.",
      "Avoid acidic foods and beverages that can worsen sensitivity.",
      "Rinse with fluoride mouthwash to help strengthen enamel.",
      "Avoid extreme temperatures in foods and beverages."
    ],
    seekHelp: "schedule"
  },
  {
    id: "knocked-out-tooth",
    title: "Knocked-Out Tooth",
    severity: "high",
    description: "A knocked-out permanent tooth is a time-sensitive emergency. Quick action may save the tooth.",
    instructions: [
      "Find the tooth and pick it up by the crown (not the root).",
      "If dirty, gently rinse with milk or water (do not scrub or remove attached tissue).",
      "Try to reinsert the tooth into its socket, facing the right way.",
      "If reinsertion isn't possible, keep the tooth moist in milk, saline solution, or saliva.",
      "Apply gauze to the socket to control bleeding."
    ],
    seekHelp: "immediate"
  },
  {
    id: "loose-tooth",
    title: "Loose or Displaced Tooth",
    severity: "high",
    description: "A loose or displaced tooth needs prompt attention to prevent loss and further damage.",
    instructions: [
      "Do not attempt to remove the tooth.",
      "Gently push the tooth back to its normal position using very light pressure.",
      "Bite down gently to keep the tooth from moving.",
      "Apply cold compresses to reduce swelling.",
      "Take over-the-counter pain relievers as directed."
    ],
    seekHelp: "immediate"
  },
  {
    id: "broken-tooth-severe",
    title: "Broken Tooth with Severe Pain",
    severity: "high",
    description: "A fractured tooth with severe pain may indicate the nerve is exposed or damaged.",
    instructions: [
      "Rinse your mouth with warm water to clean the area.",
      "Apply a cold compress to the face to reduce swelling.",
      "Take over-the-counter pain medication as directed.",
      "Cover any sharp edges with dental wax or sugar-free gum to protect your tongue and cheeks.",
      "Avoid chewing on that side of your mouth."
    ],
    seekHelp: "immediate"
  },
  {
    id: "broken-tooth-mild",
    title: "Broken Tooth with Mild Pain",
    severity: "medium",
    description: "A broken tooth with mild pain may need repair to prevent further damage and pain.",
    instructions: [
      "Rinse your mouth with warm salt water.",
      "Apply dental wax or sugar-free gum over any sharp edges.",
      "Take over-the-counter pain relievers as directed.",
      "Eat soft foods and avoid chewing on the affected side.",
      "Continue to brush gently around the area."
    ],
    seekHelp: "24hours"
  },
  {
    id: "broken-tooth-no-pain",
    title: "Broken Tooth Without Pain",
    severity: "medium",
    description: "Even without pain, a broken tooth should be evaluated to prevent complications.",
    instructions: [
      "Cover any sharp edges with dental wax if they irritate your tongue or cheek.",
      "Avoid chewing on the affected side.",
      "Continue good oral hygiene, brushing gently around the damaged area.",
      "Be cautious with temperature extremes which might trigger sensitivity.",
      "Collect any large fragments of the tooth to bring to your appointment."
    ],
    seekHelp: "24hours"
  },
  {
    id: "soft-tissue-injury",
    title: "Soft Tissue Injury",
    severity: "medium",
    description: "Injuries to the lips, tongue, cheeks, or gums can bleed significantly but usually heal well.",
    instructions: [
      "Rinse with diluted hydrogen peroxide or salt water mixture.",
      "Apply pressure with clean gauze or cloth to stop bleeding (10-15 minutes).",
      "Apply a cold compress to reduce swelling.",
      "Avoid spicy, salty, or acidic foods that may irritate the injury.",
      "Continue gentle oral hygiene to keep the area clean."
    ],
    seekHelp: "24hours"
  },
  {
    id: "heavy-bleeding",
    title: "Heavy Gum Bleeding",
    severity: "high",
    description: "Heavy, persistent bleeding from the gums may indicate a serious condition requiring immediate care.",
    instructions: [
      "Apply firm pressure to the area with clean gauze or cloth for 15-20 minutes.",
      "Rinse with cold water (not hot) to help slow bleeding.",
      "Sit upright and avoid lying flat.",
      "Apply an ice pack to the outside of the mouth or cheek.",
      "Avoid rinsing vigorously, drinking through straws, or spitting which can dislodge blood clots."
    ],
    seekHelp: "immediate"
  },
  {
    id: "moderate-bleeding",
    title: "Moderate Gum Bleeding",
    severity: "medium",
    description: "Bleeding when brushing or flossing could indicate gum disease or improper oral hygiene technique.",
    instructions: [
      "Continue gentle but thorough brushing and flossing.",
      "Use a soft-bristled toothbrush.",
      "Rinse with warm salt water or an antimicrobial mouthwash.",
      "Avoid tobacco products which worsen gum disease.",
      "Apply cold compress if there is any swelling."
    ],
    seekHelp: "24hours"
  },
  {
    id: "minor-bleeding",
    title: "Minor Gum Bleeding",
    severity: "low",
    description: "Occasional minor bleeding may be due to early gum disease (gingivitis) or brushing too hard.",
    instructions: [
      "Improve your oral hygiene routine with gentle but thorough brushing and daily flossing.",
      "Use a soft-bristled toothbrush and gentle technique.",
      "Rinse with warm salt water or antimicrobial mouthwash.",
      "Increase vitamin C intake which supports gum health.",
      "Avoid tobacco products."
    ],
    seekHelp: "schedule"
  },
  {
    id: "severe-swelling",
    title: "Severe Facial Swelling",
    severity: "high",
    description: "Severe swelling affecting breathing or swallowing could indicate a serious infection requiring emergency care.",
    instructions: [
      "Seek emergency care immediately - this could be life-threatening.",
      "Sit upright to help with breathing.",
      "Apply cold compresses to the outside of the face.",
      "Take over-the-counter pain relievers and any prescribed antibiotics as directed.",
      "Do not apply heat to the swelling as it can worsen the infection."
    ],
    seekHelp: "immediate"
  },
  {
    id: "moderate-swelling",
    title: "Moderate Facial Swelling",
    severity: "high",
    description: "Moderate facial swelling often indicates an infection that requires prompt attention.",
    instructions: [
      "Apply cold compresses to the outside of the face (20 minutes on, 20 minutes off).",
      "Take over-the-counter pain relievers as directed.",
      "Stay hydrated and rest with your head elevated.",
      "Rinse with warm salt water several times a day.",
      "Do not apply heat to the swelling."
    ],
    seekHelp: "immediate"
  },
  {
    id: "mild-swelling",
    title: "Mild Facial Swelling",
    severity: "medium",
    description: "Mild swelling may indicate a localized infection or inflammation.",
    instructions: [
      "Apply cold compresses to the affected area.",
      "Take over-the-counter pain relievers as directed.",
      "Rinse with warm salt water several times a day.",
      "Avoid very hot, cold, or spicy foods.",
      "Keep the area clean with gentle brushing and flossing."
    ],
    seekHelp: "24hours"
  },
  {
    id: "gum-abscess-severe",
    title: "Gum Abscess with Severe Pain",
    severity: "high",
    description: "A painful gum abscess is a pocket of infection that requires prompt treatment to prevent spread.",
    instructions: [
      "Rinse with warm salt water several times a day.",
      "Take over-the-counter pain relievers as directed.",
      "Apply cold compresses to the outside of the face to reduce swelling.",
      "Avoid very hot, cold, or spicy foods and beverages.",
      "Do not attempt to pop or drain the abscess yourself."
    ],
    seekHelp: "immediate"
  },
  {
    id: "gum-abscess-mild",
    title: "Gum Abscess with Mild Pain",
    severity: "medium",
    description: "Even with mild pain, a gum abscess is an infection that needs professional treatment.",
    instructions: [
      "Rinse with warm salt water several times a day.",
      "Gently floss around the affected area to remove food debris.",
      "Take over-the-counter pain relievers as directed.",
      "Avoid irritating foods and beverages.",
      "Do not attempt to pop or drain the abscess yourself."
    ],
    seekHelp: "24hours"
  },
  {
    id: "gum-swelling-no-pain",
    title: "Gum Swelling Without Pain",
    severity: "medium",
    description: "Painless gum swelling may indicate an early infection, hormonal changes, or reaction to medication.",
    instructions: [
      "Maintain thorough but gentle oral hygiene.",
      "Rinse with warm salt water or antimicrobial mouthwash.",
      "Avoid irritating foods and beverages.",
      "Apply cold compresses to the outside of the face if the swelling is noticeable.",
      "Monitor for developing pain or increases in swelling."
    ],
    seekHelp: "24hours"
  },
  {
    id: "lost-restoration",
    title: "Lost Filling or Crown",
    severity: "medium",
    description: "A lost filling or crown needs repair to protect the tooth from further damage and sensitivity.",
    instructions: [
      "Keep the crown if you have it - it may be able to be reattached.",
      "If experiencing sensitivity, apply clove oil or dental cement (available at pharmacies).",
      "Avoid chewing on that side.",
      "Take over-the-counter pain relievers if needed.",
      "Avoid very hot or cold foods and beverages."
    ],
    seekHelp: "24hours"
  },
  {
    id: "cosmetic-damage",
    title: "Damaged Veneer or Bonding",
    severity: "low",
    description: "Damaged cosmetic dental work primarily affects appearance but should be repaired to maintain results.",
    instructions: [
      "Keep any fragments that have broken off.",
      "Avoid using the damaged tooth to bite or tear food.",
      "If edges are sharp, cover with dental wax to protect soft tissues.",
      "Continue normal oral hygiene, being gentle around the damaged area.",
      "Avoid foods and beverages that stain (coffee, red wine, etc.) as damaged areas may be more susceptible."
    ],
    seekHelp: "schedule"
  }
];

const EmergencyGuide = () => {
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [resultId, setResultId] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(["start"]);

  const currentStepData = emergencySteps.find(step => step.id === currentStep);
  const resultData = resultId ? emergencyResults.find(result => result.id === resultId) : null;

  const handleOptionClick = (option: any) => {
    if (option.action === "next") {
      setHistory([...history, option.target]);
      setCurrentStep(option.target);
    } else if (option.action === "result") {
      const result = emergencyResults.find(r => r.id === option.target);
      setResultId(option.target);
      setIsEmergency(result?.seekHelp === "immediate");
      
      if (result?.seekHelp === "immediate") {
        toast({
          title: "Dental Emergency Detected",
          description: "This situation requires immediate attention.",
        });
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentStep(newHistory[newHistory.length - 1]);
      setResultId(null);
    }
  };

  const handleReset = () => {
    setCurrentStep("start");
    setResultId(null);
    setIsEmergency(false);
    setHistory(["start"]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getSeekHelpText = (seekHelp: string) => {
    switch (seekHelp) {
      case "immediate":
        return "Seek immediate dental care (within hours)";
      case "24hours":
        return "See a dentist within 24-48 hours";
      case "schedule":
        return "Schedule a routine dental appointment";
      default:
        return "Consult with a dental professional";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          Dental Emergency Guide
        </CardTitle>
        <CardDescription>
          Answer a few questions to determine the urgency of your dental situation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resultId ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-md ${getSeverityColor(resultData?.severity || "low")}`}>
              <h3 className="text-lg font-semibold">{resultData?.title}</h3>
              <p className="mt-2">{resultData?.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">What to do:</h3>
              <ul className="space-y-2 list-disc pl-5">
                {resultData?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                {resultData?.seekHelp === "immediate" ? (
                  <PhoneCall className="h-6 w-6 text-red-500 mt-0.5" />
                ) : resultData?.seekHelp === "24hours" ? (
                  <Clock className="h-6 w-6 text-amber-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {getSeekHelpText(resultData?.seekHelp || "schedule")}
                  </p>
                  {resultData?.seekHelp === "immediate" && (
                    <div className="mt-2">
                      <Button className="w-full md:w-auto bg-red-600 hover:bg-red-700">
                        <PhoneCall className="mr-2 h-4 w-4" />
                        Call Emergency Line: (555) 123-4567
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{currentStepData?.question}</h3>
            <div className="space-y-2">
              {currentStepData?.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="mr-auto">{option.text}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3 justify-between">
        <Button 
          variant="outline" 
          onClick={resultId ? handleReset : handleBack}
          disabled={currentStep === "start" && !resultId}
        >
          {resultId ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </>
          ) : (
            "Back"
          )}
        </Button>
        
        {!resultId && (
          <p className="text-sm text-muted-foreground">
            This guide is not a substitute for professional advice.
            When in doubt, contact your dentist.
          </p>
        )}
        
        {resultId && resultData?.seekHelp !== "immediate" && (
          <Button className="bg-primary hover:bg-primary/90">
            Schedule an Appointment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmergencyGuide;
