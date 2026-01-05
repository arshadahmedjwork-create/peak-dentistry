import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, ChevronDown, ChevronRight, Calendar, User, Info } from "lucide-react";
import { TreatmentDetailsModal } from './TreatmentDetailsModal';
import { useTreatmentProcedureDetails } from '@/hooks/use-treatment-data';

interface Treatment {
  id: number;
  date: string;
  procedure: string;
  dentist: string;
  details: string;
  procedure_id?: string;
  procedure_info?: any;
  category_name?: string;
}

interface TreatmentsTabProps {
  treatmentHistory: Treatment[];
}

const TreatmentsTab = ({ treatmentHistory }: TreatmentsTabProps) => {
  const [expandedTreatments, setExpandedTreatments] = useState<Set<number>>(new Set());
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(null);
  const { data: procedureDetails } = useTreatmentProcedureDetails(selectedProcedureId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const toggleTreatment = (id: number) => {
    setExpandedTreatments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleLearnMore = (procedureId: string | undefined) => {
    if (procedureId) {
      setSelectedProcedureId(procedureId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Treatment History</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
            Filter
          </Button>
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
            Print History
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {treatmentHistory.map((treatment) => {
          const isExpanded = expandedTreatments.has(treatment.id);
          const hasProcedureInfo = treatment.procedure_info && treatment.procedure_id;

          return (
            <Card key={treatment.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover-lift">
              <CardContent className="p-0">
                <Collapsible open={isExpanded} onOpenChange={() => toggleTreatment(treatment.id)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full p-6 h-auto justify-start hover:bg-white/5 text-white"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-start gap-4 flex-1">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-white/60 mt-1" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white/60 mt-1" />
                          )}
                          <div className="text-left space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-white">{treatment.procedure}</h3>
                              {treatment.category_name && (
                                <Badge variant="secondary" className="bg-white/10 text-white/90">
                                  {treatment.category_name}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/70">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(treatment.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {treatment.dentist}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4">
                      {treatment.details && (
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="font-medium text-white flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4" />
                            Treatment Notes
                          </h4>
                          <p className="text-white/80 text-sm">{treatment.details}</p>
                        </div>
                      )}

                      {hasProcedureInfo && treatment.procedure_info.description && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">About This Treatment</h4>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {treatment.procedure_info.description}
                          </p>
                        </div>
                      )}

                      {hasProcedureInfo && treatment.procedure_info.benefits && (
                        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <h4 className="font-medium text-white flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Benefits
                          </h4>
                          <p className="text-white/90 text-sm">{treatment.procedure_info.benefits}</p>
                        </div>
                      )}

                      {hasProcedureInfo && treatment.procedure_info.aftercare && (
                        <div className="bg-amber-400/10 rounded-lg p-4 border border-amber-400/20">
                          <h4 className="font-medium text-white flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-amber-400" />
                            Aftercare Instructions
                          </h4>
                          <p className="text-white/90 text-sm">{treatment.procedure_info.aftercare}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {hasProcedureInfo && (
                          <Button
                            onClick={() => handleLearnMore(treatment.procedure_id)}
                            variant="outline"
                            size="sm"
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            Learn More
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          Download Report
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {treatmentHistory.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Treatment Timeline</h3>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {treatmentHistory.length} {treatmentHistory.length === 1 ? 'Treatment' : 'Treatments'}
            </Badge>
          </div>
          
          <div className="relative">
            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {treatmentHistory.slice(0, 8).map((treatment) => (
                <Card key={treatment.id} className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover-lift">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(treatment.date)}</span>
                        </div>
                        <h4 className="font-semibold text-base text-white leading-tight">
                          {treatment.procedure}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <User className="h-3 w-3" />
                          <span>Dr. {treatment.dentist}</span>
                        </div>
                      </div>
                      {treatment.category_name && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs shrink-0">
                          {treatment.category_name}
                        </Badge>
                      )}
                    </div>
                    
                    {treatment.details && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                          {treatment.details}
                        </p>
                      </div>
                    )}
                    
                    {treatment.procedure_info?.description && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                          <span className="font-medium text-white/90">Summary: </span>
                          {treatment.procedure_info.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-white/80 border-white/20 hover:bg-white/10 text-xs h-7"
                        onClick={() => toggleTreatment(treatment.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop timeline view */}
            <div className="hidden md:block">
              {treatmentHistory.slice(0, 8).map((treatment, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={treatment.id} className="relative mb-12 last:mb-0">
                    {/* Timeline line */}
                    {index < treatmentHistory.slice(0, 8).length - 1 && (
                      <div className="absolute left-1/2 top-8 h-full w-0.5 bg-gradient-to-b from-primary/50 to-primary/20 -translate-x-1/2"></div>
                    )}
                    
                    {/* Timeline node */}
                    <div className="absolute left-1/2 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 shadow-lg shadow-primary/50"></div>
                    
                    {/* Content card */}
                    <div className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-start gap-8`}>
                      <div className={`w-5/12 ${isLeft ? 'text-right pr-4' : 'text-left pl-4'}`}>
                        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover-lift group hover:scale-105 transition-all duration-300">
                          <CardContent className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-2">
                                <div className={`flex items-center gap-2 text-xs text-white/60 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">{formatDate(treatment.date)}</span>
                                </div>
                                <h4 className="font-bold text-lg text-white leading-tight group-hover:text-primary transition-colors">
                                  {treatment.procedure}
                                </h4>
                                <div className={`flex items-center gap-2 text-sm text-white/70 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                                  <User className="h-3 w-3" />
                                  <span>Dr. {treatment.dentist}</span>
                                </div>
                              </div>
                              {treatment.category_name && (
                                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs shrink-0">
                                  {treatment.category_name}
                                </Badge>
                              )}
                            </div>
                            
                            {(treatment.details || treatment.procedure_info?.description) && (
                              <div className="pt-3 border-t border-white/10 space-y-2">
                                {treatment.details && (
                                  <p className="text-sm text-white/80 leading-relaxed">
                                    <span className="font-semibold text-white">Notes: </span>
                                    {treatment.details}
                                  </p>
                                )}
                                {treatment.procedure_info?.description && (
                                  <p className="text-sm text-white/70 leading-relaxed">
                                    <span className="font-semibold text-white/90">Overview: </span>
                                    {treatment.procedure_info.description.length > 120 
                                      ? treatment.procedure_info.description.substring(0, 120) + '...' 
                                      : treatment.procedure_info.description}
                                  </p>
                                )}
                              </div>
                            )}
                            
                            <div className={`flex gap-2 pt-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white text-xs h-8"
                                onClick={() => toggleTreatment(treatment.id)}
                              >
                                Full Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="w-2/12"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {treatmentHistory.length > 8 && (
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Showing 8 of {treatmentHistory.length} treatments
              </p>
            </div>
          )}
        </div>
      )}

      <TreatmentDetailsModal
        open={!!selectedProcedureId && !!procedureDetails}
        onOpenChange={(open) => !open && setSelectedProcedureId(null)}
        procedure={procedureDetails || null}
      />
    </div>
  );
};

export default TreatmentsTab;
