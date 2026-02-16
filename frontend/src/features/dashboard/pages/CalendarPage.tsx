import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { es } from 'date-fns/locale'; // Importar idioma español
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Plus, Calendar as CalendarIcon } from 'lucide-react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';

// Datos falsos para probar (luego conectaremos con backend)
const MOCK_TASKS = [
  { id: 1, title: 'Fertilización Lote A', date: new Date(), completed: false, type: 'urgent' },
  { id: 2, title: 'Revisión de Riego', date: new Date(), completed: true, type: 'normal' },
  { id: 3, title: 'Poda de Mantenimiento', date: new Date(new Date().setDate(new Date().getDate() + 2)), completed: false, type: 'normal' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generar los días del calendario
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Filtrar tareas del día seleccionado
  const dayTasks = MOCK_TASKS.filter(task => isSameDay(task.date, selectedDate));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="text-purple-500" />
              Agenda de Cultivo
            </h1>
            <p className="text-slate-400 text-sm">Organiza las actividades de tus lotes.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-purple-900/20">
            <Plus size={18} />
            Nueva Tarea
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          
          {/* COLUMNA 1: CALENDARIO VISUAL (2/3 del ancho) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* Header del Calendario */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronRight /></button>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grilla de Días */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const hasTask = MOCK_TASKS.some(t => isSameDay(t.date, day));

                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative h-24 rounded-xl border flex flex-col items-start justify-start p-2 cursor-pointer transition-all
                      ${isSelected ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-800/30 border-slate-800 hover:border-slate-600'}
                      ${!isCurrentMonth && 'opacity-30'}
                    `}
                  >
                    <span className={`text-sm font-bold ${isSelected ? 'text-purple-400' : 'text-slate-300'}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Indicador si hay tarea */}
                    {hasTask && (
                      <div className="mt-auto w-full flex flex-col gap-1">
                         <div className="h-1.5 w-full bg-emerald-500 rounded-full opacity-80" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMNA 2: LISTA DE TAREAS DEL DÍA (1/3 del ancho) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 capitalize border-b border-slate-800 pb-4">
              {format(selectedDate, 'EEEE, d MMMM', { locale: es })}
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {dayTasks.length > 0 ? (
                dayTasks.map(task => (
                  <div key={task.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                      </span>
                      <div className="h-2 w-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-white font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Clock size={12} />
                      <span>08:00 AM</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <CalendarIcon size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No hay tareas para este día.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}