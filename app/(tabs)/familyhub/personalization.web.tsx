/**
 * Personalization - Pantalla de personalización
 * Theme selector, color palette, widgets, nav_pages (límite 5)
 */

import { useState } from "react";
import { Check, Sun, Moon, Smartphone } from "lucide-react";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ToggleRow } from "@/components/familyhub/ToggleRow";
import { Toast } from "@/components/familyhub/Toast";
import { cn } from "@/components/ui/utils";

type ThemeMode = 'light' | 'dark' | 'auto';
type ColorPalette = 'indigo' | 'blue' | 'purple' | 'emerald' | 'rose';

interface Widget {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NavPage {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

function Personalization() {
  const [theme, setTheme] = useState<ThemeMode>('auto');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('indigo');
  const [toast, setToast] = useState({ show: false, type: 'success' as const, message: '' });
  
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'summary', name: 'Resumen diario', description: 'Vista rápida de tareas y metas', enabled: true },
    { id: 'calendar', name: 'Próximos eventos', description: 'Calendario de la semana', enabled: true },
    { id: 'finances', name: 'Estado financiero', description: 'Gastos y ahorros del mes', enabled: false },
    { id: 'ranking', name: 'Ranking familiar', description: 'Top 3 de la familia', enabled: true },
  ]);
  
  const [navPages, setNavPages] = useState<NavPage[]>([
    { id: 'home', name: 'Inicio', icon: '🏠', enabled: true },
    { id: 'calendar', name: 'Calendario', icon: '📅', enabled: true },
    { id: 'tasks', name: 'Tareas', icon: '✅', enabled: true },
    { id: 'finances', name: 'Finanzas', icon: '💰', enabled: true },
    { id: 'family', name: 'Familia', icon: '👨‍👩‍👧‍👦', enabled: true },
    { id: 'goals', name: 'Metas', icon: '🎯', enabled: false },
  ]);
  
  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Oscuro', icon: Moon },
    { id: 'auto', label: 'Auto', icon: Smartphone },
  ];
  
  const colorPalettes = [
    { id: 'indigo', name: 'Índigo', color: '#4F46E5' },
    { id: 'blue', name: 'Azul', color: '#3B82F6' },
    { id: 'purple', name: 'Morado', color: '#A855F7' },
    { id: 'emerald', name: 'Esmeralda', color: '#10B981' },
    { id: 'rose', name: 'Rosa', color: '#F43F5E' },
  ];
  
  const handleWidgetToggle = (id: string, enabled: boolean) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled } : w));
  };
  
  const handleNavPageToggle = (id: string, enabled: boolean) => {
    const enabledCount = navPages.filter(p => p.enabled).length;
    
    // Si se está deshabilitando, permitir
    if (!enabled) {
      setNavPages(navPages.map(p => p.id === id ? { ...p, enabled } : p));
      return;
    }
    
    // Si se está habilitando, verificar límite de 5
    if (enabledCount >= 5) {
      setToast({ show: true, type: 'warning', message: 'Máximo 5 páginas en la navegación' });
      return;
    }
    
    setNavPages(navPages.map(p => p.id === id ? { ...p, enabled } : p));
  };
  
  const handleSave = () => {
    setToast({ show: true, type: 'success', message: 'Preferencias guardadas correctamente' });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      <AppHeader 
        title="Personalización" 
        subtitle="Personaliza tu experiencia"
        showAddButton={false}
      />

      <main className="max-w-[390px] mx-auto px-5 py-5 space-y-6">
        {/* Tema */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">Tema</h2>
          
          <div className="bg-white p-4 rounded-2xl border border-neutral-200">
            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id as ThemeMode)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    theme === id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-neutral-200 hover:bg-neutral-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    theme === id ? "bg-indigo-100" : "bg-neutral-100"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      theme === id ? "text-indigo-600" : "text-neutral-600"
                    )} strokeWidth={2} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    theme === id ? "text-indigo-900" : "text-neutral-700"
                  )}>
                    {label}
                  </span>
                  {theme === id && (
                    <Check className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paleta de colores */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">Color principal</h2>
          
          <div className="bg-white p-4 rounded-2xl border border-neutral-200">
            <div className="grid grid-cols-5 gap-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setColorPalette(palette.id as ColorPalette)}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl transition-all relative",
                      colorPalette === palette.id && "ring-2 ring-offset-2 ring-neutral-400"
                    )}
                    style={{ backgroundColor: palette.color }}
                  >
                    {colorPalette === palette.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-neutral-600">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Widgets del inicio */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Widgets del inicio</h2>
            <p className="text-sm text-neutral-500 mt-1">Personaliza qué se muestra en la pantalla principal</p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-neutral-200">
            <div className="space-y-1 divide-y divide-neutral-100">
              {widgets.map((widget) => (
                <ToggleRow
                  key={widget.id}
                  label={widget.name}
                  description={widget.description}
                  checked={widget.enabled}
                  onChange={(enabled) => handleWidgetToggle(widget.id, enabled)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Páginas de navegación */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Navegación</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Selecciona hasta 5 páginas para la barra inferior
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2 py-1 rounded-lg bg-indigo-100">
                <span className="text-sm font-medium text-indigo-700">
                  {navPages.filter(p => p.enabled).length}/5 páginas
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-neutral-200">
            <div className="space-y-1 divide-y divide-neutral-100">
              {navPages.map((page) => (
                <ToggleRow
                  key={page.id}
                  label={
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{page.icon}</span>
                      {page.name}
                    </span>
                  }
                  checked={page.enabled}
                  onChange={(enabled) => handleNavPageToggle(page.id, enabled)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-xl font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: '#4F46E5' }}
          >
            Guardar cambios
          </button>
        </div>
      </main>

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



export default Personalization;

;