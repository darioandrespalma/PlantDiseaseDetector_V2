import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/auth.store';
// Pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import LandingPage from '@/features/dashboard/pages/LandingPage';
import DashboardHome from '@/features/dashboard/pages/DashboardHome';
import NewPredictionPage from '@/features/detection/pages/NewPredictionPage';
import NewsPage from '@/features/dashboard/pages/NewsPage';

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
  // --- RUTAS PÚBLICAS ---
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

  // --- RUTAS PROTEGIDAS (Solo usuarios logueados) ---
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardHome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/nueva-prediccion', // 🔒 AHORA ESTÁ PROTEGIDA
    element: (
      <ProtectedRoute>
        <NewPredictionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/noticias',
    element: (
      <ProtectedRoute>
        <NewsPage />
      </ProtectedRoute>
    ),
  },

  // --- RUTAS DE MANTENIMIENTO ---
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);