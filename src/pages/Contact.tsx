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
            <h1 className={`text-5xl font-medium mb-6 ${isDark ? 'text-white' : ''}`}>Contact Us</h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
              Have questions or ready to book your appointment? Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className={`section-padding ${isDark ? 'bg-peak-gray-800' : ''}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <SectionHeader 
                title="Get In Touch" 
                subtitle="We're here to answer any questions you may have about our services or to help you schedule an appointment."
              />
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-100'}`}>
                    <MapPin className={`${isDark ? 'text-white' : 'text-peak-black'} shrink-0`} size={24} />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : ''}`}>Location</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>B38, Prithvi Avenue 2nd Street, Abiramapuram, Alwarpet, Chennai – 600018</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-100'}`}>
                    <Phone className={`${isDark ? 'text-white' : 'text-peak-black'} shrink-0`} size={24} />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : ''}`}>Phone</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>
                      <a href="tel:+917373044044" className={`${isDark ? 'hover:text-white' : 'hover:text-peak-black'} transition-colors`}>+91 73 73 044 044</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-100'}`}>
                    <Mail className={`${isDark ? 'text-white' : 'text-peak-black'} shrink-0`} size={24} />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : ''}`}>Email</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>
                      <a href="mailto:contact@peak-dentistry.com" className={`${isDark ? 'hover:text-white' : 'hover:text-peak-black'} transition-colors`}>contact@peak-dentistry.com</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-100'}`}>
                    <Clock className={`${isDark ? 'text-white' : 'text-peak-black'} shrink-0`} size={24} />
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : ''}`}>Hours</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>Mon–Fri: 10:30 AM – 7:30 PM</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>Sat: 10:30 AM – 6:00 PM</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-peak-gray-600'}`}>Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : ''}`}>Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'bg-peak-gray-700 hover:bg-peak-gray-600' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Facebook size={20} className={isDark ? 'text-white' : ''} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'bg-peak-gray-700 hover:bg-peak-gray-600' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Instagram size={20} className={isDark ? 'text-white' : ''} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'bg-peak-gray-700 hover:bg-peak-gray-600' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Linkedin size={20} className={isDark ? 'text-white' : ''} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'bg-peak-gray-700 hover:bg-peak-gray-600' : 'bg-peak-gray-200 hover:bg-peak-gray-300'} p-3 rounded-full transition-colors`}>
                    <Twitter size={20} className={isDark ? 'text-white' : ''} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={`py-12 ${isDark ? 'bg-peak-gray-900' : ''}`}>
        <div className="container-custom">
          <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0876089430395!2d80.25612731528!3d13.033940917058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526779e1d6f3a1%3A0x6b8e8c5a9b8a8e0a!2sAbiramapuram%2C%20Alwarpet%2C%20Chennai%2C%20Tamil%20Nadu%20600018!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PEAK Dentistry Location"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
