import type { ReactNode } from 'react';
import { Bug } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex">
            {/* Left side - Branding */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900"
            >
                <div className="absolute inset-0 bg-black/80" />
                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur flex items-center justify-center">
                            <Bug className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-primary-foreground">IssueTracker</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
                        Track, Manage, and<br />Resolve Issues<br />Effortlessly
                    </h1>

                    <p className="text-lg text-primary-foreground/80 max-w-md">
                        A modern issue tracking solution designed for teams who value simplicity and efficiency.
                    </p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
                <div className="mx-auto w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Bug className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">IssueTracker</span>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        <p className="mt-2 text-muted-foreground">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
