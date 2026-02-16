import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthLayout from '@/shared/components/templates/AuthLayout';
import { authService } from '../api/auth.service';

// Esquema de validación: Contraseña min 6 caracteres y que coincidan
const resetSchema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { token } = useParams(); // LEEMOS EL TOKEN DE LA URL
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) return;
    setStatus('loading');
    try {
      await authService.resetPassword(token, data.password);
      setStatus('success');
      // Redirigir al login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Token inválido o expirado');
    }
  };

  return (
    <AuthLayout title="Nueva Contraseña" subtitle="Crea una contraseña segura">
      {status === 'success' ? (
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">¡Contraseña Actualizada!</h3>
          <p className="text-gray-400">Tu contraseña ha sido cambiada correctamente.</p>
          <p className="text-sm text-purple-400">Redirigiendo al login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Nueva Contraseña</label>
            <div className="relative">
                <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••••"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow transition-all"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Confirmar Contraseña</label>
            <div className="relative">
                <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••••"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow transition-all"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg flex justify-center items-center"
          >
            {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Cambiar Contraseña'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}