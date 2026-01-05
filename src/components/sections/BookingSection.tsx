
import React from 'react';
import SectionHeader from '@/components/ui/section-header';
import BookingForm from '@/components/ui/booking-form';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { Button } from '@/components/ui/button';
import { CalendarPlus, ArrowRight, Calendar, CalendarCheck, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

const BookingSection = () => {
  return (
    <section id="booking-section" className="py-20 relative">
      <AnimatedGradient />
      <div className="container-custom">
        <SectionHeader 
          title="Book Your Visit" 
          subtitle="Schedule your appointment with our expert team for a personalized consultation"
          center
        />
        
        <Tabs defaultValue="calendly" className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="calendly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Real-time Scheduling
            </TabsTrigger>
            <TabsTrigger value="form" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Request Appointment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendly" className="mt-0">
            <Card className="border border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="bg-accent/20 p-4 rounded-lg flex gap-3 items-start mb-2">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Why use real-time scheduling?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get instant confirmation by booking directly through our Calendly integration. 
                        See real-time availability and choose the perfect time for your visit.
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-[500px] border rounded-md overflow-y-auto bg-white relative">
                    {/* Placeholder for Calendly embed - In a real implementation, you would use the Calendly embed code here */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-background/5 overflow-y-auto">
                      <div className="max-w-md w-full space-y-6">
                        <img 
                          src="/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png" 
                          alt="Peak Dentistry" 
                          className="h-12 mx-auto mb-6 opacity-20" 
                        />
                        <h3 className="text-xl font-bold mb-2 text-center">Choose your appointment type</h3>
                        <p className="text-center text-muted-foreground mb-8">
                          Select from available appointments and receive instant confirmation
                        </p>
                        
                        <div className="grid gap-3 w-full">
                          {["New Patient Consultation", "Routine Check-up", "Dental Cleaning", "Emergency Visit"].map((type, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              className="justify-between hover:border-primary hover:bg-primary/5 group transition-all duration-300"
                              type="button"
                            >
                              <span>{type}</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <Button type="button" className="w-full">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            View All Appointment Types
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Your appointment will be instantly confirmed. Reschedule anytime if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form" className="mt-0">
            <div className="max-w-2xl mx-auto scroll-fade-in">
              <p className="text-center text-sm text-muted-foreground mb-6">
                Fill out the form below and we'll contact you to schedule your appointment
              </p>
              <BookingForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default BookingSection;
