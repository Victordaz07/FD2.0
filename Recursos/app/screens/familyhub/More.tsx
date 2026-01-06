/**
 * More - Menú de configuración y ajustes
 */

import { 
  User, 
  Settings, 
  Palette, 
  Lock, 
  Bell, 
  Globe, 
  HelpCircle, 
  LogOut,
  Shield,
  ChevronRight
} from "lucide-react";
import { ListCard } from "../../components/familyhub/ListCard";

const menuSections = [
  {
    title: 'Cuenta',
    items: [
      { icon: User, label: 'Mi perfil', color: 'bg-blue-100 text-blue-600' },
      { icon: Shield, label: 'Seguridad', color: 'bg-purple-100 text-purple-600', badge: 'PIN, Face ID' },
    ],
  },
  {
    title: 'Preferencias',
    items: [
      { icon: Settings, label: 'Ajustes generales', color: 'bg-neutral-100 text-neutral-600' },
      { icon: Palette, label: 'Personalización', color: 'bg-pink-100 text-pink-600' },
      { icon: Bell, label: 'Notificaciones', color: 'bg-amber-100 text-amber-600' },
      { icon: Globe, label: 'Idioma', color: 'bg-emerald-100 text-emerald-600', badge: 'Español' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { icon: HelpCircle, label: 'Centro de ayuda', color: 'bg-indigo-100 text-indigo-600' },
    ],
  },
];

export function More() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[390px] mx-auto px-5 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Más</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Configuración y ajustes
          </p>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-5 py-6 space-y-6">
        {/* Perfil del usuario */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
              👨
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">Papá (Robert)</h3>
              <p className="text-white/80 text-sm mt-0.5">robert@email.com</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-white/20">
                <Shield className="w-3 h-3" />
                <span className="text-xs font-semibold">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menú de opciones */}
        {menuSections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h2>
            
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={itemIdx}
                    className="w-full bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className="font-medium text-neutral-900">{item.label}</p>
                        {item.badge && (
                          <p className="text-xs text-neutral-500 mt-0.5">{item.badge}</p>
                        )}
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Cerrar sesión */}
        <button className="w-full bg-white p-4 rounded-xl border-2 border-rose-200 hover:bg-rose-50 active:scale-[0.99] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-rose-600" strokeWidth={2} />
            </div>
            
            <p className="flex-1 text-left font-semibold text-rose-600">
              Cerrar sesión
            </p>
            
            <ChevronRight className="w-5 h-5 text-rose-400 flex-shrink-0" />
          </div>
        </button>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500 font-medium">FamilyDash v1.0.0</p>
          <p className="text-xs text-neutral-400 mt-1">Hecho con ❤️ para familias</p>
        </div>
      </main>
    </div>
  );
}