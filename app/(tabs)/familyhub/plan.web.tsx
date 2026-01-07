/**
 * Plan - HUB de organización
 * 3 cards grandes: Tareas, Metas, Calendario
 */

import { CheckSquare, Target, CalendarDays } from "lucide-react";
import { HubCard } from "@/components/familyhub/HubCard";

interface PlanProps {
  onNavigate?: (subRoute: string) => void;
}

function Plan({ onNavigate }: PlanProps = {}) {
  const defaultNavigate = onNavigate || (() => {});
  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[390px] mx-auto px-5 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Plan</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Organiza tareas, metas y eventos
          </p>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-5 py-6 space-y-4">
        {/* Card: Tareas */}
        <HubCard
          icon={CheckSquare}
          title="Tareas"
          description="Gestiona las actividades diarias"
          value="8"
          badge="pendientes"
          color="blue"
          onClick={() => defaultNavigate('tasks')}
        />

        {/* Card: Metas */}
        <HubCard
          icon={Target}
          title="Metas"
          description="Objetivos familiares a largo plazo"
          progress={65}
          color="purple"
          onClick={() => defaultNavigate('goals')}
        />

        {/* Card: Calendario */}
        <HubCard
          icon={CalendarDays}
          title="Calendario"
          description="Visualiza y programa eventos"
          value="12"
          badge="este mes"
          color="emerald"
          onClick={() => defaultNavigate('calendar')}
        />

        {/* Info motivacional */}
        <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📊</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-sm mb-1">
                Consejo del día
              </h3>
              <p className="text-sm text-blue-700">
                Divide las metas grandes en tareas pequeñas y alcanzables.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



export default Plan;

;