import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Calendar } from "lucide-react";
import { useAppointments, useTreatments } from '@/hooks/use-supabase-data';
import { format } from 'date-fns';

interface DashboardWelcomeProps {
  userName?: string;
}

const DashboardWelcome = ({ userName = "Guest" }: DashboardWelcomeProps) => {
  const firstName = userName.split(' ')[0];
  const { appointments } = useAppointments();
  const { treatments } = useTreatments();
  
  // Get next upcoming appointment
  const nextAppointment = appointments
    ?.filter(apt => apt.status === 'scheduled' && apt.date && apt.time)
    ?.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  
  const nextVisitText = nextAppointment && nextAppointment.date && nextAppointment.time
    ? format(new Date(`${nextAppointment.date} ${nextAppointment.time}`), 'MMM d')
    : 'None';
  
  const activeTreatments = treatments?.length || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Welcome back, {firstName}!
                </h2>
              </div>
              <p className="text-muted-foreground">
                Your smile journey continues. Check your upcoming appointments and health overview.
              </p>
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart className="h-12 w-12 text-primary/60" fill="currentColor" />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10"
            >
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Health Score</p>
                <p className="text-lg font-bold">Excellent</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Next Visit</p>
                <p className="text-lg font-bold">{nextVisitText}</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Treatments</p>
                <p className="text-lg font-bold">{activeTreatments}</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardWelcome;
