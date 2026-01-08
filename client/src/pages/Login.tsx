import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/api/axios';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', { email: data.email, password: data.password });
            setAuth(res.data.user, res.data.token);

            toast({
                title: 'Welcome back!',
                description: 'You have been logged in successfully.',
            });

            navigate('/');
        } catch (error: unknown) {
            toast({
                title: 'Login failed',
                description: error instanceof Error ? error.message : 'Invalid credentials',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        {...register('email')}
                        className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...register('password')}
                            className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign in
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}
