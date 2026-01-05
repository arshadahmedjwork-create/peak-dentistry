import React from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`pt-32 pb-16 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-medium mb-6">Contact Us</h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
              Have questions or ready to book your appointment? Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <SectionHeader 
                title="Get In Touch" 
                subtitle="We're here to answer any questions you may have about our services or to help you schedule an appointment."
              />
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-peak-black mr-4 shrink-0" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-peak-gray-600">B38, Prithvi Avenue 2nd Street, Abiramapuram, Alwarpet, Chennai – 600018</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-peak-black mr-4 shrink-0" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-peak-gray-600">
                      <a href="tel:+917373044044" className="hover:text-peak-black transition-colors">+91 73 73 044 044</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-peak-black mr-4 shrink-0" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-peak-gray-600">
                      <a href="mailto:contact@peak-dentistry.com" className="hover:text-peak-black transition-colors">contact@peak-dentistry.com</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-peak-black mr-4 shrink-0" size={24} />
                  <div>
                    <h4 className="font-medium mb-1">Hours</h4>
                    <p className="text-peak-gray-600">Mon–Fri: 10:30 AM – 7:30 PM</p>
                    <p className="text-peak-gray-600">Sat: 10:30 AM – 6:00 PM</p>
                    <p className="text-peak-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" className={`${isDark ? 'bg-peak-gray-800 hover:bg-peak-gray-700' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Facebook size={20} />
                  </a>
                  <a href="https://instagram.com" className={`${isDark ? 'bg-peak-gray-800 hover:bg-peak-gray-700' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Instagram size={20} />
                  </a>
                  <a href="https://linkedin.com" className={`${isDark ? 'bg-peak-gray-800 hover:bg-peak-gray-700' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Linkedin size={20} />
                  </a>
                  <a href="https://twitter.com" className={`${isDark ? 'bg-peak-gray-800 hover:bg-peak-gray-700' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
            {/* Placeholder for Google Map - would be replaced with actual map implementation */}
            <div className="w-full h-full bg-peak-gray-300 flex items-center justify-center">
              <p className="text-peak-gray-700 font-medium">Google Map Location</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
