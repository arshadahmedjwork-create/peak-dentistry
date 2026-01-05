import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import BookingForm from '@/components/ui/booking-form';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/use-theme';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject || null,
          message: data.message,
          status: 'new',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });

      form.reset();
    } catch (error: any) {
      const safeMessage = handleError(error, 'Contact Form Submission');
      toast({
        title: 'Submission Failed',
        description: safeMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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

              {/* Contact Form */}
              <div className={`${isDark ? 'bg-peak-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mt-8`}>
                <h3 className="text-2xl font-medium mb-6">Send us a Message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="What is this about?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            
            <div>
              <BookingForm />
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
