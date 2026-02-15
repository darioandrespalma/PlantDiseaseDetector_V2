import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import AuthLayout from '@/shared/components/templates/AuthLayout';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '../api/auth.service';
import { loginSchema, LoginFormValues } from '../types/auth.types';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(data);
      login(res.token, { 
        id: res.user._id, 
        name: res.user.username, 
        email: data.email, 
        role: res.user.role 
      });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Bienvenido de nuevo" 
      subtitle="Accede a tu panel de monitoreo IA"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* INPUT: EMAIL */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
            <input
                {...register('email')}
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500
                           focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow
                           transition-all duration-200"
            />
            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
        </div>

        {/* INPUT: PASSWORD */}
        <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-300">Contraseña</label>
                <Link to="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <input
                {...register('password')}
                type="password"
                placeholder="••••••••••"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500
                           focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow
                           transition-all duration-200"
            />
            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
        </div>

        {/* BOTÓN GRADIENTE (Estilo Open) */}
        <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                       text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-900/20
                       transform hover:-translate-y-0.5 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex justify-center items-center"
        >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Iniciar Sesión'}
        </button>

        {/* FOOTER TEXT */}
        <div className="text-center mt-6 text-sm text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-white hover:text-purple-300 font-medium transition-colors">
                Regístrate gratis
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}