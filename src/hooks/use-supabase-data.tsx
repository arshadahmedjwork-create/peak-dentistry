import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

// Appointments
export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .neq('status', 'cancelled') // Filter out cancelled appointments
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      
      // Map database fields to component expected format and filter by date/time
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      
      const mappedAppointments = (data || [])
        .map(apt => ({
          id: apt.id,
          type: apt.appointment_type,
          date: apt.appointment_date,
          time: apt.appointment_time,
          dentist: apt.dentist_name,
          notes: apt.notes || '',
          status: apt.status
        }))
        .filter(apt => {
          // Only show future appointments or today's appointments that haven't passed
          if (apt.date > currentDate) return true;
          if (apt.date === currentDate && apt.time > currentTime) return true;
          return false;
        });
      
      setAppointments(mappedAppointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return { appointments, loading, refetch: fetchAppointments };
};

// Past Appointments
export const usePastAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPastAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .neq('status', 'cancelled')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      // Map database fields and filter past appointments
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      
      const mappedAppointments = (data || [])
        .map(apt => ({
          id: apt.id,
          type: apt.appointment_type,
          date: apt.appointment_date,
          time: apt.appointment_time,
          dentist: apt.dentist_name,
          notes: apt.notes || '',
          status: apt.status
        }))
        .filter(apt => {
          // Only show past appointments (completed or past date/time)
          if (apt.date < currentDate) return true;
          if (apt.date === currentDate && apt.time <= currentTime) return true;
          return false;
        });
      
      setAppointments(mappedAppointments);
    } catch (error: any) {
      console.error('Error fetching past appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastAppointments();
  }, [user]);

  return { appointments, loading, refetch: fetchPastAppointments };
};

// Admin: All Appointments
export const useAllAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, profiles(first_name, last_name, email)')
        .neq('status', 'cancelled') // Filter out cancelled appointments
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      
      // Map database fields to component expected format
      const mappedAppointments = (data || []).map(apt => ({
        id: apt.id,
        type: apt.appointment_type,
        date: apt.appointment_date,
        time: apt.appointment_time,
        dentist: apt.dentist_name,
        notes: apt.notes || '',
        status: apt.status,
        patient_id: apt.patient_id,
        profiles: apt.profiles
      }));
      
      setAppointments(mappedAppointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { appointments, loading, refetch: fetchAppointments };
};

// Treatments
export const useTreatments = () => {
  const { user } = useAuth();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('treatments')
        .select(`
          *,
          procedure:treatment_procedures (
            id,
            name,
            description,
            benefits,
            aftercare,
            procedure_details,
            category:treatment_categories (
              id,
              name
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('treatment_date', { ascending: false });

      if (error) throw error;
      
      // Map database fields to component expected format
      const mappedTreatments = (data || []).map(treatment => ({
        id: treatment.id,
        date: treatment.treatment_date,
        procedure: treatment.procedure_name,
        dentist: treatment.dentist_name,
        details: treatment.details || '',
        tooth_number: treatment.tooth_number,
        procedure_id: treatment.procedure_id,
        procedure_info: treatment.procedure,
        category_name: treatment.procedure?.category?.name || null
      }));
      
      setTreatments(mappedTreatments);
    } catch (error: any) {
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, [user]);

  return { treatments, loading, refetch: fetchTreatments };
};

// Documents
export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('patient_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      
      // Map database fields to component expected format
      const mappedDocuments = (data || []).map(doc => ({
        id: doc.id,
        name: doc.document_name,
        type: doc.file_type?.toUpperCase() || doc.document_type || 'PDF',
        date: doc.upload_date,
        size: doc.file_size_bytes 
          ? `${(doc.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
          : 'Unknown',
        file_url: doc.file_url,
        file_type: doc.file_type,
        document_type: doc.document_type
      }));
      
      setDocuments(mappedDocuments);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return { documents, loading, refetch: fetchDocuments };
};

// Invoices
export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('patient_id', user.id)
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format in BillingTab
      const transformedData = (data || []).map(invoice => ({
        id: invoice.id,
        date: invoice.invoice_date,
        description: invoice.description || invoice.service_type || 'No description',
        totalAmount: Number(invoice.total_amount || 0),
        insuranceCovered: Number(invoice.insurance_covered || 0),
        amountPaid: Number(invoice.amount_paid || 0),
        status: invoice.status === 'paid' ? 'Paid' : invoice.status === 'pending' ? 'Pending' : 'Overdue'
      }));
      
      setInvoices(transformedData);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  return { invoices, loading, refetch: fetchInvoices };
};

// Profile
export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
};

// Notification Preferences
export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setPreferences(data);
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been saved.',
      });

      await fetchPreferences();
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return { preferences, loading, updatePreferences, refetch: fetchPreferences };
};

// Blog Posts (Public)
export const useBlogPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, refetch: fetchPosts };
};

// Gallery Images (Public)
export const useGalleryImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, loading, refetch: fetchImages };
};

// Admin: All Patients
export const useAllPatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          appointments(count),
          treatments(count),
          invoices(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, refetch: fetchPatients };
};

// Oral Health Metrics
export const useOralHealthMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('oral_health_metrics')
        .select('*')
        .eq('patient_id', user.id)
        .order('assessed_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setMetrics(data);
    } catch (error: any) {
      console.error('Error fetching oral health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  return { metrics, loading, refetch: fetchMetrics };
};

// Notifications
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      await fetchNotifications();
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('patient_id', user.id)
        .eq('status', 'unread');

      if (error) throw error;
      await fetchNotifications();
      
      toast({
        title: 'Notifications Cleared',
        description: 'All notifications marked as read.',
      });
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear notifications.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription
    if (user) {
      const channel = (supabase as any)
        .channel('notifications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `patient_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { notifications, loading, markAsRead, clearAll, refetch: fetchNotifications };
};

// Contact Submissions
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  try {
    const { error } = await supabase.from('contact_submissions').insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
        status: 'new',
      },
    ]);

    if (error) throw error;

    toast({
      title: 'Message Sent',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });

    return { error: null };
  } catch (error: any) {
    toast({
      title: 'Submission Failed',
      description: error.message || 'Please try again later.',
      variant: 'destructive',
    });
    return { error };
  }
};
