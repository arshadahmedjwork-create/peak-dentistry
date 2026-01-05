
import React from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import ServiceCard from '@/components/ui/service-card';
import BookingForm from '@/components/ui/booking-form';
import { Smile, Shield, Zap, PenTool, Baby, Stethoscope } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Services = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const services = [
    {
      title: "Smile Design & Makeover",
      description: "Transform your smile with our custom makeover solutions tailored to your unique facial features.",
      icon: <PenTool className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "2-4 Weeks",
      painLevel: "Minimal",
      link: "/services/smile-design"
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your smile's beauty with our advanced cosmetic treatments and procedures.",
      icon: <Smile className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "1-2 Weeks",
      painLevel: "Minimal",
      link: "/services/cosmetic-dentistry"
    },
    {
      title: "Implantology & Full Mouth Rehab",
      description: "Restore full functionality and aesthetics with our comprehensive rehabilitation services.",
      icon: <Shield className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "2-6 Months",
      painLevel: "Moderate",
      link: "/services/implantology"
    },
    {
      title: "Laser Dentistry",
      description: "Experience minimal-discomfort treatments with our state-of-the-art laser technology.",
      icon: <Zap className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "30-60 Minutes",
      painLevel: "Minimal",
      link: "/services/laser-dentistry"
    },
    {
      title: "Pediatric & Preventive Dentistry",
      description: "Child-friendly dental care and preventive treatments for the whole family.",
      icon: <Baby className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "30-45 Minutes",
      painLevel: "None",
      link: "/services/pediatric-dentistry"
    },
    {
      title: "General Dentistry",
      description: "Comprehensive dental care services for maintaining optimal oral health.",
      icon: <Stethoscope className={isDark ? "text-white" : "text-peak-black"} size={24} />,
      duration: "30-60 Minutes",
      painLevel: "Minimal",
      link: "/services/general-dentistry"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`pt-32 pb-16 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-medium mb-6">Our Services</h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
              Experience premium dental care with our comprehensive range of services, all delivered with precision and luxury in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader 
            title="Comprehensive Dental Solutions" 
            subtitle="We offer a wide range of premium dental services designed to meet all your oral health needs."
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div key={index} className="animate-on-scroll animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  duration={service.duration}
                  painLevel={service.painLevel}
                  link={service.link}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className={`py-20 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader 
                title="Book Your Consultation" 
                subtitle="Ready to transform your smile? Schedule a consultation with our experts to discuss your dental needs."
              />
              
              <div className="space-y-4 max-w-md">
                <p className={isDark ? 'text-gray-300' : 'text-peak-gray-700'}>
                  Our team of experienced dentists will provide personalized care and address all your concerns. We look forward to welcoming you to PEAK Dentistry.
                </p>
              </div>
            </div>
            
            <div>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
