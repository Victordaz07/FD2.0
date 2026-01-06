/**
 * Home - Dashboard principal
 * Saludo + resumen rápido en cards clicables
 */

import { Zap, CheckSquare, Calendar, Trophy } from "lucide-react";
import { StatsCard } from "../../components/familyhub/StatsCard";
import { cn } from "../../components/ui/utils";

interface HomeProps {
  onNavigate: (tab: string, subRoute?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const currentHour = new Date().getHours();
  const greeting = 
    currentHour < 12 ? '¡Buenos días!' :
    currentHour < 18 ? '¡Buenas tardes!' :
    '¡Buenas noches!';
  
  const userName = 'Papá';
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[390px] mx-auto px-5 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
              👨
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">
                {greeting}
              </h1>
              <p className="text-sm text-neutral-500 capitalize">
                {currentDate}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-5 py-6 space-y-6">
        {/* Resumen rápido */}
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-3 px-1">
            Resumen rápido
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              emoji="🔥"
              title="Racha familiar"
              value="15 días"
              subtitle="¡Sigan así!"
              color="amber"
              onClick={() => onNavigate('family')}
            />
            
            <StatsCard
              icon={CheckSquare}
              title="Pendientes"
              value="8"
              subtitle="tareas hoy"
              color="blue"
              onClick={() => onNavigate('plan', 'tasks')}
            />
            
            <StatsCard
              icon={Calendar}
              title="Próximos"
              value="3"
              subtitle="eventos"
              color="purple"
              onClick={() => onNavigate('plan', 'calendar')}
            />
            
            <StatsCard
              icon={Trophy}
              title="Puntos"
              value="4,250"
              subtitle="familia"
              color="emerald"
              onClick={() => onNavigate('family')}
            />
          </div>
        </section>

        {/* Actividad reciente */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold text-neutral-900">
              Actividad reciente
            </h2>
            <button className="text-sm font-medium text-indigo-600">
              Ver todo
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    Emma completó "Hacer la tarea"
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Hace 2 horas • +50 puntos
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    Reunión familiar mañana
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    18:00 • Toda la familia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    ¡Nueva meta de ahorro creada!
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Vacaciones 2026 • $15,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Motivación */}
        <section>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💪</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">¡Excelente trabajo!</h3>
                <p className="text-sm text-white/80">
                  Tu familia ha completado el 75% de las tareas esta semana. ¡Sigan así!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
