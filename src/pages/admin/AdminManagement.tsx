import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Shield, Mail, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from 'zod';
import { strongPasswordSchema } from '@/utils/form-validation';

const adminSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  password: strongPasswordSchema
});

const AdminManagement = () => {
  const { user, isAdmin } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchAdmins = async () => {
    // Get all admin user IDs
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (roleError) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive"
      });
      return;
    }

    if (!roleData || roleData.length === 0) {
      setAdmins([]);
      return;
    }

    // Get profiles for all admin users
    const adminIds = roleData.map(r => r.user_id);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', adminIds);

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to fetch admin profiles",
        variant: "destructive"
      });
      return;
    }

    // Combine the data
    const adminData = roleData.map(role => ({
      user_id: role.user_id,
      role: 'admin',
      profiles: profileData?.find(p => p.id === role.user_id)
    }));

    setAdmins(adminData);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = adminSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      }
    });

    if (authError) {
      const safeMessage = handleError(authError, 'Admin User Creation');
      toast({
        title: "Error",
        description: safeMessage,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!authData.user) {
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Assign admin role using the setup function
    const { error: roleError } = await supabase.rpc('setup_admin_user', {
      p_user_id: authData.user.id,
      p_user_email: formData.email
    });

    if (roleError) {
      console.error('setup_admin_user error:', roleError);
      toast({
        title: "Error",
        description: `Failed to assign admin role: ${roleError.message}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Admin account created successfully"
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
      setIsDialogOpen(false);
      fetchAdmins();
    }

    setLoading(false);
  };

  const handleDeleteAdmin = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Admin removed successfully"
      });
      fetchAdmins();
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
            <p className="text-muted-foreground">
              Manage administrator accounts and permissions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create Admin Account</DialogTitle>
                  <DialogDescription>
                    Add a new administrator to the system. They will receive full access.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Admin'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Administrators</CardTitle>
            <CardDescription>
              View and manage all administrator accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin: any) => (
                  <TableRow key={admin.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={admin.profiles?.profile_image_url} />
                          <AvatarFallback>
                            {admin.profiles?.first_name?.[0]}{admin.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {admin.profiles?.first_name} {admin.profiles?.last_name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {admin.profiles?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        <Shield className="mr-1 h-3 w-3" />
                        Administrator
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.profiles?.created_at ? new Date(admin.profiles.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {admin.user_id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAdmin(admin.user_id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
