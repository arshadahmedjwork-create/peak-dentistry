
import React from 'react';
import SectionHeader from '@/components/ui/section-header';
import BookingForm from '@/components/ui/booking-form';
import AnimatedGradient from '@/components/ui/animated-gradient';

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
        
        <div className="max-w-2xl mx-auto scroll-fade-in">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Fill out the form below and we'll contact you to schedule your appointment
          </p>
          <BookingForm />
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
