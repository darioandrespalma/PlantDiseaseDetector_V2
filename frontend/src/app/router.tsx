import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/auth.store';

// Pages
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import LandingPage from '@/features/dashboard/pages/LandingPage'; // IMPORTAR NUEVA PÁGINA

// Layouts Placeholder
const DashboardLayout = ({ children }: any) => <div>Sidebar + Navbar + {children}</div>;
const DashboardHome = () => <h1 className="p-10 text-2xl">Bienvenido al Dashboard</h1>;

// Guards
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  // Si ya está logueado, lo mandamos al dashboard, si no, ve la página pública
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    // La Landing Page es pública. Si quieres que los logueados no la vean, usa PublicRoute
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
    path: '/dashboard', // Nueva ruta para el panel privado
    element: (
      <ProtectedRoute>
        <DashboardLayout><DashboardHome /></DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);