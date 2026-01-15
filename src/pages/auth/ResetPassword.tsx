
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const passwordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if we have the access token in the URL (Supabase puts it in the hash)
        const hash = window.location.hash;
        const query = window.location.search;

        // Simple check to ensure we're likely in a recovery flow
        // Supabase usually redirects with #access_token=...&type=recovery
        if (!hash && !query) {
            // If no tokens, this page shouldn't be accessed directly normally
            // But we'll stay here to allow manual entry if session is active
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate inputs
        const result = passwordSchema.safeParse({ password, confirmPassword });
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

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
            toast({
                title: "Password Updated",
                description: "Your password has been successfully reset. You can now login.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Failed to update password. Link may have expired.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-custom py-28 flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md animate-fade-in glass">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
                        <CardDescription className="text-center">
                            Please enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="space-y-6 text-center py-4">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/40 w-20 h-20 flex items-center justify-center mx-auto ring-8 ring-green-50 dark:ring-green-900/20">
                                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-2">Password Reset Successful</h3>
                                    <p className="text-muted-foreground">
                                        Your password has been securely updated. You can now access your account with your new credentials.
                                    </p>
                                </div>
                                <Link to="/auth/login">
                                    <Button className="w-full">
                                        Go to Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10"
                                            disabled={loading}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                            disabled={loading}
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating password...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    {!success && (
                        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
                            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors">
                                <ArrowLeft className="mr-1 h-3 w-3" />
                                Back to Login
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default ResetPassword;
