
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useMagnetic } from '@/hooks/use-magnetic';

const ClinicInfoSection = () => {
  const [buttonRef, { isHovering }] = useMagnetic<HTMLButtonElement>({
    strength: 20,
    scale: 1.05
  });

  return (
    <section className="py-16 bg-peak-gray-100">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-medium mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="mr-4 mt-1 text-peak-black" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Address</h4>
                    <p className="text-peak-gray-600">
                      B38, Prithvi Avenue 2nd Street, Abiramapuram, Alwarpet, Chennai – 600018
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mr-4 mt-1 text-peak-black" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-peak-gray-600">
                      <a href="tel:+917373044044" className="hover:text-peak-black transition-colors">
                        +91 73 73 044 044
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="mr-4 mt-1 text-peak-black" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-peak-gray-600">
                      <a href="mailto:contact@peak-dentistry.com" className="hover:text-peak-black transition-colors">
                        contact@peak-dentistry.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="mr-4 mt-1 text-peak-black" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Hours</h4>
                    <p className="text-peak-gray-600">Mon–Fri: 10:30 AM – 7:30 PM</p>
                    <p className="text-peak-gray-600">Sat: 10:30 AM – 6:00 PM</p>
                    <p className="text-peak-gray-600">Sun: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  ref={buttonRef}
                  className={`magnetic-button btn-primary ${isHovering ? 'scale-105' : ''}`}
                >
                  <Phone className="mr-2" size={18} />
                  Call Now
                </Button>
              </div>
            </div>
            
            <div className="h-full">
              <div className="w-full h-full min-h-[400px] bg-peak-gray-200">
                {/* Google Maps Embed would go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-peak-gray-600">Interactive Map</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicInfoSection;
