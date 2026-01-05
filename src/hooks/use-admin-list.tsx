import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  formatted_name: string; // Dr. FirstName LastName
}

export const useAdminList = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      
      // Get users with admin role
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      const adminIds = adminRoles?.map(r => r.user_id) || [];

      if (adminIds.length === 0) {
        setAdmins([]);
        return;
      }

      // Get profiles for these admins
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', adminIds);

      if (profilesError) throw profilesError;

      // Format admin names with "Dr." prefix
      const formattedAdmins = (profiles || []).map(profile => ({
        ...profile,
        formatted_name: `Dr. ${profile.first_name} ${profile.last_name}`
      }));

      setAdmins(formattedAdmins);
    } catch (error) {
      console.error('Error fetching admin list:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading, refetch: fetchAdmins };
};
