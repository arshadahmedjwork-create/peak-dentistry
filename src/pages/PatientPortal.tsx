
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Star, ArrowRight } from 'lucide-react';
import PatientPortal from '@/components/features/PatientPortal';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PatientPortalPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Layout>
      <div className="container-custom pt-32 pb-28 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white text-shadow-xl' : 'text-peak-black'}`}
            variants={itemVariants}
          >
            Patient Portal
          </motion.h1>
          <motion.p
            className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-white text-shadow-lg' : 'text-muted-foreground'}`}
            variants={itemVariants}
          >
            Explore our innovative tools designed to enhance your dental experience and help you make informed decisions about your oral health.
          </motion.p>

          {/* Feature tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-8"
            variants={itemVariants}
          >
            {['Patient Portal', 'Virtual Consultations', 'Interactive Tools', 'Digital Records'].map((tag, index) => (
              <span
                key={index}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-black/5 text-peak-black'
                  } hover-lift`}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PatientPortal />
        </motion.div>

        <motion.div
          className="mt-28"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Alert className={`mb-8 ${isDark ? 'bg-peak-gray-800/90 text-white' : 'bg-peak-gray-100/90'} backdrop-blur-sm border-l-4 ${isDark ? 'border-white/20' : 'border-peak-black/20'}`}>
            <Info className="h-5 w-5" />
            <AlertTitle className={`${isDark ? 'text-white' : ''} mb-2`}>Have a Suggestion?</AlertTitle>
            <AlertDescription className={`${isDark ? 'text-peak-gray-200' : ''} mb-4`}>
              We value your feedback! If you have ideas for new features or improvements to enhance your dental experience,
              we'd love to hear from you.
            </AlertDescription>

            <Button
              variant="ghost"
              size="sm"
              className={`mt-4 ${isDark ? 'text-white hover:bg-white/10' : 'text-peak-black hover:bg-black/5'}`}
            >
              <span>Request a Feature</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PatientPortalPage;
