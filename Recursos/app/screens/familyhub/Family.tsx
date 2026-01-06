/**
 * Family - Pantalla de familia
 * Lista de miembros + Ranking
 */

import { useState } from "react";
import { Crown, Trophy, TrendingUp, Users } from "lucide-react";
import { AppHeader } from "../../components/familyhub/AppHeader";
import { ListCard } from "../../components/familyhub/ListCard";
import { cn } from "../../components/ui/utils";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasksCompleted: number;
  goalsAchieved: number;
  points: number;
  streak: number;
}

type ViewMode = 'list' | 'ranking';

export function Family() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const members: FamilyMember[] = [
    { id: 'mom', name: 'Mamá (Sarah)', avatar: '👩', role: 'Admin', tasksCompleted: 142, goalsAchieved: 18, points: 1250, streak: 15 },
    { id: 'dad', name: 'Papá (Robert)', avatar: '👨', role: 'Admin', tasksCompleted: 127, goalsAchieved: 15, points: 1180, streak: 12 },
    { id: 'emma', name: 'Emma', avatar: '👧', role: 'Miembro', tasksCompleted: 89, goalsAchieved: 10, points: 890, streak: 8 },
    { id: 'jake', name: 'Jake', avatar: '👦', role: 'Miembro', tasksCompleted: 67, goalsAchieved: 7, points: 720, streak: 5 },
  ];
  
  const sortedByPoints = [...members].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      <AppHeader 
        title="Familia" 
        subtitle="4 miembros"
        showAddButton={false}
      />

      <main className="max-w-[390px] mx-auto px-5 py-5 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-neutral-200">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-medium transition-all",
              viewMode === 'list'
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('ranking')}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-medium transition-all",
              viewMode === 'ranking'
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            Ranking
          </button>
        </div>

        {/* Vista: Lista */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Miembros</h2>
            
            {members.map((member) => (
              <ListCard
                key={member.id}
                title={member.name}
                subtitle={member.role}
                leftContent={
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
                    {member.avatar}
                  </div>
                }
                rightContent={
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{member.points} pts</p>
                    <p className="text-xs text-neutral-500">{member.tasksCompleted} tareas</p>
                  </div>
                }
                showChevron
              />
            ))}
          </div>
        )}

        {/* Vista: Ranking */}
        {viewMode === 'ranking' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Tabla de posiciones</h2>
            
            {sortedByPoints.map((member, index) => {
              const rank = index + 1;
              const medalColor = 
                rank === 1 ? 'bg-amber-100 text-amber-600' :
                rank === 2 ? 'bg-slate-200 text-slate-600' :
                rank === 3 ? 'bg-orange-100 text-orange-600' :
                'bg-neutral-100 text-neutral-600';
              
              return (
                <div
                  key={member.id}
                  className={cn(
                    "bg-white p-4 rounded-2xl border-2 transition-all",
                    rank === 1 && "border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0",
                      medalColor
                    )}>
                      {rank === 1 && <Crown className="w-5 h-5" />}
                      {rank !== 1 && `#${rank}`}
                    </div>
                    
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {member.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900">{member.name}</p>
                      <p className="text-sm text-neutral-500">{member.role}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-neutral-900">{member.points}</p>
                      <p className="text-xs text-neutral-500">puntos</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{member.tasksCompleted}</p>
                      <p className="text-xs text-neutral-500">Tareas</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{member.goalsAchieved}</p>
                      <p className="text-xs text-neutral-500">Metas</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{member.streak} días</p>
                      <p className="text-xs text-neutral-500">Racha</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats generales */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-neutral-900">Estadísticas familiares</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-neutral-50">
              <p className="text-2xl font-bold text-neutral-900">
                {members.reduce((sum, m) => sum + m.tasksCompleted, 0)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">Tareas totales</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-neutral-50">
              <p className="text-2xl font-bold text-neutral-900">
                {members.reduce((sum, m) => sum + m.goalsAchieved, 0)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">Metas logradas</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-neutral-50">
              <p className="text-2xl font-bold text-neutral-900">
                {Math.max(...members.map(m => m.streak))}
              </p>
              <p className="text-sm text-neutral-500 mt-1">Mejor racha</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-neutral-50">
              <p className="text-2xl font-bold text-neutral-900">
                {members.reduce((sum, m) => sum + m.points, 0)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">Puntos totales</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
