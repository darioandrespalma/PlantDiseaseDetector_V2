import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/auth.store';

// Pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import LandingPage from '@/features/dashboard/pages/LandingPage';
import DashboardHome from '@/features/dashboard/pages/DashboardHome'; // Importar Dashboard

// Guards
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute><LandingPage /></PublicRoute>, 
  },
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><RegisterPage /></PublicRoute>,
  },
  {
    path: '/dashboard', // Ruta protegida
    element: (
      <ProtectedRoute>
        {/* El Layout ya está dentro de DashboardHome, pero si prefieres separarlo puedes hacerlo */}
        <DashboardHome />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);