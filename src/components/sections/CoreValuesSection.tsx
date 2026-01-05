
import React from 'react';
import SectionHeader from '@/components/ui/section-header';
import { Shield, Smile, Zap } from 'lucide-react';

const CoreValuesSection = () => {
  const values = [
    {
      title: "Commitment",
      description: "We are committed to providing patient-first excellence in every aspect of our dental care.",
      icon: <Shield className="text-peak-black" size={24} />
    },
    {
      title: "Compassion",
      description: "We deliver gentle, ethical, and empathetic care that puts your comfort first.",
      icon: <Smile className="text-peak-black" size={24} />
    },
    {
      title: "Conscience",
      description: "We practice transparent and ethical dentistry with integrity in everything we do.",
      icon: <Zap className="text-peak-black" size={24} />
    }
  ];

  return (
    <section className="py-20 bg-peak-gray-100 relative overflow-hidden">
      <div className="container-custom">
        <SectionHeader 
          title={<span className="gradient-text">Our Core Values</span>}
          subtitle="At PEAK Dentistry, our practice is built on three fundamental pillars that guide everything we do."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm transition-all duration-500 hover-glow premium-card scroll-fade-in"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-peak-gray-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 revolve-animation hover-rotate" style={{ animationDuration: `${20 + index * 5}s` }}>
                {value.icon}
              </div>
              <h3 className="text-xl font-medium mb-3 futuristic-border">{value.title}</h3>
              <p className="text-peak-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
