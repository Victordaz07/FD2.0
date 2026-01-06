/**
 * FamilyHub - HUB de familia y gamificación
 * Miembros, puntos, ranking
 */

import { Crown, Star, TrendingUp, Plus } from "lucide-react";
import { ListCard } from "../../components/familyhub/ListCard";
import { cn } from "../../components/ui/utils";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  points: number;
  tasksCompleted: number;
  rank: number;
}

export function FamilyHub() {
  const members: FamilyMember[] = [
    { id: '1', name: 'Mamá (Sarah)', avatar: '👩', role: 'Admin', points: 1250, tasksCompleted: 42, rank: 1 },
    { id: '2', name: 'Papá (Robert)', avatar: '👨', role: 'Admin', points: 1180, tasksCompleted: 38, rank: 2 },
    { id: '3', name: 'Emma', avatar: '👧', role: 'Miembro', points: 890, tasksCompleted: 28, rank: 3 },
    { id: '4', name: 'Jake', avatar: '👦', role: 'Miembro', points: 720, tasksCompleted: 21, rank: 4 },
  ];
  
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  const totalTasks = members.reduce((sum, m) => sum + m.tasksCompleted, 0);

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[390px] mx-auto px-5 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Familia</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Puntos, ranking y motivación
          </p>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-5 py-6 space-y-6">
        {/* Card resumen */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-2xl text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Total familiar</p>
              <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
              <p className="text-white/70 text-sm mt-1">puntos acumulados</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              🏆
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold">{members.length}</p>
              <p className="text-white/70 text-sm">miembros</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTasks}</p>
              <p className="text-white/70 text-sm">tareas completadas</p>
            </div>
          </div>
        </div>

        {/* Ranking rápido (Top 3) */}
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-3 px-1">
            🏅 Ranking de la semana
          </h2>
          
          <div className="bg-white p-4 rounded-2xl border border-neutral-200">
            <div className="space-y-3">
              {members.slice(0, 3).map((member) => {
                const medalEmoji = member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉';
                
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {medalEmoji}
                    </div>
                    
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
                      {member.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 text-sm">
                        {member.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {member.tasksCompleted} tareas
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">{member.points}</p>
                      <p className="text-xs text-neutral-500">pts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Todos los miembros */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold text-neutral-900">
              Miembros de la familia
            </h2>
            <button className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="space-y-2">
            {members.map((member) => (
              <ListCard
                key={member.id}
                title={member.name}
                subtitle={`${member.role} • ${member.tasksCompleted} tareas`}
                leftContent={
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
                    {member.avatar}
                  </div>
                }
                rightContent={
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">{member.points}</p>
                    <p className="text-xs text-neutral-500">puntos</p>
                  </div>
                }
                showChevron
              />
            ))}
          </div>
        </section>

        {/* Acciones rápidas */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md active:scale-[0.99] transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 mx-auto">
                <Star className="w-6 h-6 text-amber-600" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-neutral-900 text-center">
                Asignar puntos
              </p>
            </button>
            
            <button className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md active:scale-[0.99] transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 mx-auto">
                <TrendingUp className="w-6 h-6 text-emerald-600" strokeWidth={2} />
              </div>
              <p className="text-sm font-semibold text-neutral-900 text-center">
                Ver estadísticas
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
