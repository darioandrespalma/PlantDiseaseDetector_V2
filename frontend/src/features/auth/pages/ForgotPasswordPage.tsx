import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import AuthLayout from '@/shared/components/templates/AuthLayout'; // Asegura que esta ruta sea correcta
import { authService } from '../api/auth.service';

// Validación del formulario
const forgotSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setStatus('loading');
    try {
      await authService.forgotPassword(data.email);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Ingresa tu correo para recibir instrucciones"
    >
      {status === 'success' ? (
        // --- ESTADO DE ÉXITO ---
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Mail size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Correo Enviado!</h3>
            <p className="text-gray-400">
                Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y spam).
            </p>
          </div>
          <Link 
            to="/login" 
            className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors border border-slate-700"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      ) : (
        // --- FORMULARIO ---
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {status === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
              Hubo un error al enviar el correo. Por favor verifica que el correo sea correcto e intenta nuevamente.
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
            <input
                {...register('email')}
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 input-glow transition-all duration-200"
            />
            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-900/20 transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Enviando...
                </>
            ) : 'Enviar Enlace de Recuperación'}
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}