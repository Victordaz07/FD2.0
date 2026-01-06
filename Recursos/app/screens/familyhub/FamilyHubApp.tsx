/**
 * FamilyDashApp - App principal con navegación de 5 tabs
 */

import { useState } from "react";
import { BottomNavigation, TabId } from "../../components/familyhub/BottomNavigation";
import { Home } from "./Home";
import { Plan } from "./Plan";
import { FamilyHub } from "./FamilyHub";
import { House } from "./House";
import { More } from "./More";

// Sub-pantallas (placeholders)
import { Calendar } from "./Calendar";
import { Finances } from "./Finances";

export function FamilyDashApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [subRoute, setSubRoute] = useState<string | null>(null);

  const handleNavigate = (tab: string, route?: string) => {
    if (tab === 'plan' && route) {
      setActiveTab('plan');
      setSubRoute(route);
    } else if (tab === 'house' && route) {
      setActiveTab('house');
      setSubRoute(route);
    } else if (tab === 'family' || tab === 'home' || tab === 'more') {
      setActiveTab(tab as TabId);
      setSubRoute(null);
    } else {
      setActiveTab(tab as TabId);
    }
  };

  const handlePlanNavigate = (route: string) => {
    setSubRoute(route);
  };

  const handleHouseNavigate = (route: string) => {
    setSubRoute(route);
  };

  const renderScreen = () => {
    // Sub-rutas de Plan
    if (activeTab === 'plan' && subRoute) {
      if (subRoute === 'tasks') {
        return (
          <div className="min-h-screen bg-[#F6F7FB] pb-20">
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
              <div className="max-w-[390px] mx-auto px-5 py-4 flex items-center gap-3">
                <button 
                  onClick={() => setSubRoute(null)}
                  className="w-9 h-9 rounded-lg hover:bg-neutral-100 flex items-center justify-center"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900">Tareas</h1>
                  <p className="text-sm text-neutral-500">8 pendientes</p>
                </div>
              </div>
            </header>
            <div className="max-w-[390px] mx-auto px-5 py-6">
              <p className="text-neutral-500">Lista de tareas aquí...</p>
            </div>
          </div>
        );
      }
      if (subRoute === 'goals') {
        return (
          <div className="min-h-screen bg-[#F6F7FB] pb-20">
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
              <div className="max-w-[390px] mx-auto px-5 py-4 flex items-center gap-3">
                <button 
                  onClick={() => setSubRoute(null)}
                  className="w-9 h-9 rounded-lg hover:bg-neutral-100 flex items-center justify-center"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900">Metas</h1>
                  <p className="text-sm text-neutral-500">65% progreso</p>
                </div>
              </div>
            </header>
            <div className="max-w-[390px] mx-auto px-5 py-6">
              <p className="text-neutral-500">Metas familiares aquí...</p>
            </div>
          </div>
        );
      }
      if (subRoute === 'calendar') {
        return <Calendar />;
      }
    }

    // Sub-rutas de House
    if (activeTab === 'house' && subRoute) {
      if (subRoute === 'shopping') {
        return (
          <div className="min-h-screen bg-[#F6F7FB] pb-20">
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
              <div className="max-w-[390px] mx-auto px-5 py-4 flex items-center gap-3">
                <button 
                  onClick={() => setSubRoute(null)}
                  className="w-9 h-9 rounded-lg hover:bg-neutral-100 flex items-center justify-center"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900">Compras</h1>
                  <p className="text-sm text-neutral-500">12 items pendientes</p>
                </div>
              </div>
            </header>
            <div className="max-w-[390px] mx-auto px-5 py-6">
              <p className="text-neutral-500">Listas de compras aquí...</p>
            </div>
          </div>
        );
      }
      if (subRoute === 'finances') {
        return <Finances />;
      }
    }

    // Pantallas principales
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'plan':
        return <Plan onNavigate={handlePlanNavigate} />;
      case 'family':
        return <FamilyHub />;
      case 'house':
        return <House onNavigate={handleHouseNavigate} />;
      case 'more':
        return <More />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}