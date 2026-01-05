
import React from 'react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';
import { Award, Zap, MapPin } from 'lucide-react';
import { useMagnetic } from '@/hooks/use-magnetic';

const AboutSection = () => {
  const [buttonRef, { isHovering }] = useMagnetic<HTMLButtonElement>({
    strength: 20,
    scale: 1.05
  });

  return (
    <section id="about-section" className="py-20 relative overflow-hidden bg-white">
      <div className="container-custom">
        <SectionHeader
          title="Redefining Dental Care in Chennai"
          subtitle="Where technology meets compassion for exceptional dental care"
          center
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-center">
          <div className="relative scroll-fade-in">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1000"
                alt="PEAK Dentistry Clinic"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="font-medium text-peak-black">Formerly Crest Clinic</p>
            </div>
          </div>
          
          <div className="space-y-6 scroll-fade-in">
            <p className="text-lg text-peak-gray-700">
              Formerly Crest Clinic, PEAK Dentistry blends cutting-edge dental technology with compassionate care. Our clinic is led by renowned specialists and built around American Dental Association (ADA) standards.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-peak-gray-100 rounded-full text-peak-black">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">India's Best Dental Clinic Award Winner</h3>
                  <p className="text-peak-gray-600">Recognized for excellence in dental care and patient satisfaction</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-peak-gray-100 rounded-full text-peak-black">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Pioneers in high-tech dental treatments</h3>
                  <p className="text-peak-gray-600">Utilizing the latest technology for precise and comfortable care</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-peak-gray-100 rounded-full text-peak-black">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Located in Chennai's posh locality, Alwarpet</h3>
                  <p className="text-peak-gray-600">Convenient access to premium dental care in a luxurious setting</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                ref={buttonRef}
                className={`magnetic-button btn-primary ${isHovering ? 'scale-105' : ''}`}
              >
                Meet Our Specialists
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
