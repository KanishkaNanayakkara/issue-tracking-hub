import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,

    PlusCircle,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    Bug
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';

interface AppLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    // { name: 'Issues', href: '/issues', icon: ListTodo }, // Dashboard/Issues are similar now
    { name: 'New Issue', href: '/issues/new', icon: PlusCircle },
];

export function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDark, toggle } = useThemeStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-sidebar-border",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                                <Bug className="w-5 h-5 text-sidebar-primary-foreground" />
                            </div>
                            <span className="text-lg font-semibold text-sidebar-foreground">IssueTracker</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href ||
                                (item.href === '/issues' && location.pathname.startsWith('/issues/') && location.pathname !== '/issues/new');

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-sidebar-border">
                        <div className="flex items-center gap-3 px-3 py-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                                <span className="text-sm font-medium text-sidebar-foreground">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sidebar-foreground truncate">
                                    {user?.name || user?.email || 'User'}
                                </p>
                                <p className="text-xs text-sidebar-foreground/60 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent justify-start"
                                onClick={toggle}
                            >
                                {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                {isDark ? 'Light' : 'Dark'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2 ml-4">
                        <Bug className="w-5 h-5 text-primary" />
                        <span className="font-semibold">IssueTracker</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <div className="container py-6 lg:py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
