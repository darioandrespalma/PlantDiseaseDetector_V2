import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff} from 'lucide-react';

import AuthLayout from '@/shared/components/templates/AuthLayout';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '../api/auth.service';
import { registerSchema, RegisterFormValues } from '../types/auth.types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(data);
      login(res.token, { 
        id: res.user._id, 
        name: res.user.username, 
        email: data.email, 
        role: res.user.role 
      });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Crea tu cuenta" 
      subtitle="Comienza a optimizar tus cultivos hoy"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* INPUT: USERNAME */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Nombre de Usuario</label>
            <input
                {...register('username')}
                type="text"
                placeholder="Tu nombre o finca"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500
                           focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow
                           transition-all duration-200"
            />
            {errors.username && <p className="text-xs text-red-400 ml-1">{errors.username.message}</p>}
        </div>

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
            <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
            <div className="relative"> {/* Contenedor relativo para posicionar el icono */}
                <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500
                              focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow
                              transition-all duration-200"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-400 transition-colors"
                >
                    {showPassword ? <EyeOff /> : <Eye />} {/* Cambiar entre Eye y EyeOff de lucide-react */}
                </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
        </div>

        {/* BOTÓN GRADIENTE */}
        <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                       text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-900/20
                       transform hover:-translate-y-0.5 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex justify-center items-center"
        >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Registrarse'}
        </button>

        <div className="text-center mt-6 text-sm text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-white hover:text-purple-300 font-medium transition-colors">
                Ingresa aquí
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
}