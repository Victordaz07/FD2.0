/**
 * Settings - Pantalla de configuración
 */

import { 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Palette,
  User,
  Shield
} from "lucide-react";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ListCard } from "@/components/familyhub/ListCard";
import { ToggleRow } from "@/components/familyhub/ToggleRow";
import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  
  const settingsSections = [
    {
      title: 'Cuenta',
      items: [
        { icon: User, label: 'Perfil personal', action: 'navigate' },
        { icon: Shield, label: 'Privacidad y seguridad', action: 'navigate' },
      ],
    },
    {
      title: 'Preferencias',
      items: [
        { icon: Palette, label: 'Personalización', action: 'navigate' },
        { icon: Bell, label: 'Notificaciones', action: 'navigate' },
      ],
    },
    {
      title: 'Ayuda',
      items: [
        { icon: HelpCircle, label: 'Centro de ayuda', action: 'navigate' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      <AppHeader 
        title="Configuración" 
        subtitle="Ajustes de la aplicación"
        showAddButton={false}
      />

      <main className="max-w-[390px] mx-auto px-5 py-5 space-y-5">
        {/* Perfil del usuario */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl flex-shrink-0">
              👨
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900">Papá (Robert)</h3>
              <p className="text-sm text-neutral-500 mt-0.5">robert@email.com</p>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg bg-indigo-100">
                <Shield className="w-3 h-3 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones rápidas */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-4">Notificaciones</h3>
          <div className="space-y-1 divide-y divide-neutral-100">
            <ToggleRow
              label="Push notifications"
              description="Recibir notificaciones en el dispositivo"
              checked={notifications}
              onChange={setNotifications}
            />
            <ToggleRow
              label="Email"
              description="Resumen diario por correo"
              checked={emailNotif}
              onChange={setEmailNotif}
            />
          </div>
        </div>

        {/* Secciones de configuración */}
        {settingsSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide px-1">
              {section.title}
            </h2>
            
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                
                return (
                  <ListCard
                    key={itemIdx}
                    title={item.label}
                    leftContent={
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neutral-600" strokeWidth={2} />
                      </div>
                    }
                    showChevron
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Cerrar sesión */}
        <div className="bg-white p-4 rounded-2xl border-2 border-rose-200">
          <button className="w-full flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-rose-600" strokeWidth={2} />
            </div>
            <p className="flex-1 text-left font-medium text-rose-600">Cerrar sesión</p>
            <ChevronRight className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        {/* Info de la app */}
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500">FamilyHub v1.0.0</p>
          <p className="text-xs text-neutral-400 mt-1">Hecho con ❤️ para familias</p>
        </div>
      </main>
    </div>
  );
}



export default Settings;

;