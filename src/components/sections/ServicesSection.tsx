
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';
import ServiceCard from '@/components/ui/service-card';
import { PenTool, Smile, Shield, Zap, Baby, ArrowRight } from 'lucide-react';
import FloatingElements from '@/components/ui/floating-elements';

const ServicesSection = () => {
  const services = [
    {
      title: "Smile Design & Makeover",
      description: "Transform your smile with our custom makeover solutions tailored to your unique facial features.",
      icon: <PenTool className="text-peak-black" size={24} />,
      duration: "2-4 Weeks",
      painLevel: "Minimal",
      link: "/services/smile-design",
      delay: 0
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your smile's beauty with our advanced cosmetic treatments and procedures.",
      icon: <Smile className="text-peak-black" size={24} />,
      duration: "1-2 Weeks",
      painLevel: "Minimal",
      link: "/services/cosmetic-dentistry",
      delay: 100
    },
    {
      title: "Implantology & Full Mouth Rehab",
      description: "Restore full functionality and aesthetics with our comprehensive rehabilitation services.",
      icon: <Shield className="text-peak-black" size={24} />,
      duration: "2-6 Months",
      painLevel: "Moderate",
      link: "/services/implantology",
      delay: 200
    },
    {
      title: "Laser Dentistry",
      description: "Experience minimal-discomfort treatments with our state-of-the-art laser technology.",
      icon: <Zap className="text-peak-black" size={24} />,
      duration: "30-60 Minutes",
      painLevel: "Minimal",
      link: "/services/laser-dentistry",
      delay: 300
    },
    {
      title: "Pediatric & Preventive Dentistry",
      description: "Child-friendly dental care and preventive treatments for the whole family.",
      icon: <Baby className="text-peak-black" size={24} />,
      duration: "30-45 Minutes",
      painLevel: "None",
      link: "/services/pediatric-dentistry",
      delay: 400
    }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <FloatingElements />
      <div className="container-custom relative z-10">
        <SectionHeader 
          title={<span className="gradient-text">Our Premium Services</span>}
          subtitle="We offer a comprehensive range of dental services, all delivered with precision and luxury in mind."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="animate-on-scroll animate-fade-in" style={{ animationDelay: `${service.delay}ms` }}>
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
          
          <div className="animate-on-scroll animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="glass h-full p-8 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-medium mb-4">Discover All Services</h3>
              <p className="text-peak-gray-600 mb-6">View our complete range of luxury dental treatments and procedures.</p>
              <Link to="/services">
                <Button className="btn-primary flex items-center gap-2">
                  View All Services
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
