import { useAuthStore } from '../store/useAuthStore';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export const Layout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    IssueTracker
                </Link>
                {user ? (
                    <div className="flex items-center gap-6">
                        <span className="text-gray-600 font-medium">Hello, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Login</Link>
                        <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">Register</Link>
                    </div>
                )}
            </nav>
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};
