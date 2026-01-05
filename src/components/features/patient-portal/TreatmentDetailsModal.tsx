import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TreatmentProcedure } from '@/hooks/use-treatment-data';

interface TreatmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: TreatmentProcedure | null;
}

export const TreatmentDetailsModal: React.FC<TreatmentDetailsModalProps> = ({
  open,
  onOpenChange,
  procedure,
}) => {
  const navigate = useNavigate();

  if (!procedure) return null;

  const handleBookNow = () => {
    onOpenChange(false);
    navigate('/patient/book-appointment');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-accent/5">
        <DialogHeader>
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit">
              {procedure.category?.name}
            </Badge>
            <DialogTitle className="text-3xl text-white">{procedure.name}</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="procedure" className="text-white data-[state=active]:bg-primary">
              Procedure
            </TabsTrigger>
            <TabsTrigger value="aftercare" className="text-white data-[state=active]:bg-primary">
              Aftercare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {procedure.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  What is this treatment?
                </h3>
                <p className="text-white/80 leading-relaxed">{procedure.description}</p>
              </div>
            )}

            {procedure.benefits && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Benefits
                </h3>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/90 leading-relaxed">{procedure.benefits}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="procedure" className="space-y-4 mt-6">
            {procedure.procedure_details ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Procedure Steps</h3>
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <p className="text-white/90 leading-relaxed whitespace-pre-line">
                    {procedure.procedure_details}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
                <p className="text-white/60">
                  Detailed procedure information will be discussed during your consultation.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="aftercare" className="space-y-4 mt-6">
            {procedure.aftercare ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  Post-Treatment Care
                </h3>
                <div className="bg-amber-400/10 rounded-lg p-5 border border-amber-400/20">
                  <p className="text-white/90 leading-relaxed">{procedure.aftercare}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
                <p className="text-white/60">
                  Aftercare instructions will be provided after your treatment.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
          <Button onClick={handleBookNow} className="flex-1" size="lg">
            <Calendar className="mr-2 h-5 w-5" />
            Book This Treatment
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
