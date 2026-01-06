/**
 * Calendar - Pantalla de calendario
 * Tabs: Día, Semana, Mes
 * Navegación: Hoy/Prev/Next
 * Leyenda: Tareas (azul), Metas (morado), Eventos (índigo)
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import { AppHeader } from "../../components/familyhub/AppHeader";
import { EmptyState } from "../../components/familyhub/EmptyState";
import { ListCard } from "../../components/familyhub/ListCard";
import { SheetFormLayout } from "../../components/familyhub/SheetFormLayout";
import { FormField } from "../../components/familyhub/FormField";
import { SelectField } from "../../components/familyhub/SelectField";
import { Toast } from "../../components/familyhub/Toast";
import { cn } from "../../components/ui/utils";

type ViewMode = 'day' | 'week' | 'month';
type EventType = 'task' | 'goal' | 'event';

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  assignedTo: string;
}

const eventTypeColors = {
  task: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
  goal: { bg: '#FAF5FF', border: '#A855F7', text: '#7E22CE' },
  event: { bg: '#EEF2FF', border: '#6366F1', text: '#4338CA' },
};

const eventTypeLabels = {
  task: 'Tarea',
  goal: 'Meta',
  event: 'Evento',
};

export function Calendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [showTemplateSheet, setShowTemplateSheet] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success' as const, message: '' });
  
  // Mock data
  const events: CalendarEvent[] = [
    { id: '1', title: 'Comprar despensa', type: 'task', date: '2026-01-06', time: '10:00', assignedTo: 'Mamá' },
    { id: '2', title: 'Leer 10 libros', type: 'goal', date: '2026-01-06', assignedTo: '__all__' },
    { id: '3', title: 'Reunión familiar', type: 'event', date: '2026-01-06', time: '18:00', assignedTo: '__all__' },
  ];
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
    if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
    if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const handleSaveEvent = () => {
    setShowEventSheet(false);
    setToast({ show: true, type: 'success', message: 'Evento creado exitosamente' });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      <AppHeader 
        title="Calendario" 
        subtitle="Organiza actividades familiares"
        onAddClick={() => setShowEventSheet(true)}
      />

      <main className="max-w-[390px] mx-auto px-5 py-5 space-y-5">
        {/* Navegación fecha */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">
                {currentDate.toLocaleDateString('es-ES', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-sm text-neutral-500">
                {currentDate.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
          
          <button
            onClick={handleToday}
            className="w-full h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-700 transition-colors"
          >
            Hoy
          </button>
        </div>

        {/* Tabs de vista */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-neutral-200">
          {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium transition-all",
                viewMode === mode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {mode === 'day' && 'Día'}
              {mode === 'week' && 'Semana'}
              {mode === 'month' && 'Mes'}
            </button>
          ))}
        </div>

        {/* Leyenda */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <p className="text-sm font-medium text-neutral-700 mb-3">Leyenda</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
              <span className="text-sm text-neutral-600">Tareas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A855F7' }} />
              <span className="text-sm text-neutral-600">Metas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6366F1' }} />
              <span className="text-sm text-neutral-600">Eventos</span>
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Actividades</h2>
            <button
              onClick={() => setShowTemplateSheet(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Plantillas
            </button>
          </div>
          
          {events.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="Sin actividades"
              description="No hay actividades programadas para esta fecha"
              actionLabel="Crear actividad"
              onAction={() => setShowEventSheet(true)}
            />
          ) : (
            events.map((event) => (
              <ListCard
                key={event.id}
                title={event.title}
                subtitle={`${event.time || 'Todo el día'} • ${event.assignedTo === '__all__' ? 'Toda la familia' : event.assignedTo}`}
                leftContent={
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: eventTypeColors[event.type].bg }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventTypeColors[event.type].border }}
                    />
                  </div>
                }
                onClick={() => setShowEventSheet(true)}
                showChevron
              />
            ))
          )}
        </div>
      </main>

      {/* Sheet: Crear/Editar Evento */}
      <SheetFormLayout
        isOpen={showEventSheet}
        onClose={() => setShowEventSheet(false)}
        title="Nueva actividad"
        description="Crea una tarea, meta o evento"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowEventSheet(false)}
              className="flex-1 h-12 rounded-xl border-2 border-neutral-200 font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEvent}
              className="flex-1 h-12 rounded-xl font-medium text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: '#4F46E5' }}
            >
              Guardar
            </button>
          </div>
        }
      >
        <FormField label="Título" placeholder="Ej: Comprar despensa" />
        
        <SelectField label="Tipo">
          <option value="task">Tarea</option>
          <option value="goal">Meta</option>
          <option value="event">Evento</option>
        </SelectField>
        
        <SelectField label="Asignado a">
          <option value="__all__">Toda la familia</option>
          <option value="mom">Mamá</option>
          <option value="dad">Papá</option>
          <option value="emma">Emma</option>
          <option value="jake">Jake</option>
        </SelectField>
        
        <FormField label="Fecha" type="date" />
        
        <FormField label="Hora (opcional)" type="time" />
        
        <FormField 
          label="Notas (opcional)" 
          placeholder="Detalles adicionales..."
        />
      </SheetFormLayout>

      {/* Sheet: Plantillas */}
      <SheetFormLayout
        isOpen={showTemplateSheet}
        onClose={() => setShowTemplateSheet(false)}
        title="Plantillas"
        description="Eventos predefinidos para uso rápido"
      >
        <EmptyState
          icon={CalendarDays}
          title="Sin plantillas"
          description="Crea plantillas para eventos recurrentes"
          actionLabel="Crear plantilla"
          onAction={() => setShowTemplateSheet(false)}
        />
      </SheetFormLayout>

      {/* Toast */}
      <Toast
        isVisible={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
