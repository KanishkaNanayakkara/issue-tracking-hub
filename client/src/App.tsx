import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssuesListPage from './pages/IssuesList';
import { IssueForm } from './pages/IssueForm';
import { IssueDetails } from './pages/IssueDetails';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/issues" element={user ? <IssuesListPage /> : <Navigate to="/login" />} />
          <Route path="/issues/new" element={user ? <IssueForm /> : <Navigate to="/login" />} />
          <Route path="/issues/:id" element={user ? <IssueDetails /> : <Navigate to="/login" />} />
          <Route path="/issues/:id/edit" element={user ? <IssueForm /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
