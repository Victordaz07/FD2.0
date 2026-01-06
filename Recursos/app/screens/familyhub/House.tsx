/**
 * House - HUB de hogar (Compras + Finanzas)
 */

import { ShoppingCart, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { HubCard } from "../../components/familyhub/HubCard";
import { cn } from "../../components/ui/utils";

interface HouseProps {
  onNavigate: (subRoute: string) => void;
}

export function House({ onNavigate }: HouseProps) {
  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-[390px] mx-auto px-5 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Hogar</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Gestiona compras y finanzas
          </p>
        </div>
      </header>

      <main className="max-w-[390px] mx-auto px-5 py-6 space-y-4">
        {/* Card: Compras */}
        <HubCard
          icon={ShoppingCart}
          title="Compras"
          description="Listas de compras organizadas"
          value="12"
          badge="items pendientes"
          color="emerald"
          onClick={() => onNavigate('shopping')}
        />

        {/* Card: Finanzas */}
        <HubCard
          icon={DollarSign}
          title="Finanzas"
          description="Control de gastos y ahorros"
          value="$2,400"
          badge="gastos del mes"
          color="blue"
          onClick={() => onNavigate('finances')}
        />

        {/* Resumen rápido */}
        <section className="mt-6">
          <h2 className="text-base font-semibold text-neutral-900 mb-3 px-1">
            Resumen del mes
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-rose-600" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-neutral-600">Gastos</span>
              </div>
              <p className="text-xl font-bold text-neutral-900">$2,400</p>
              <p className="text-xs text-neutral-500 mt-1">15 transacciones</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-neutral-600">Ahorros</span>
              </div>
              <p className="text-xl font-bold text-neutral-900">$8,500</p>
              <p className="text-xs text-neutral-500 mt-1">2 metas activas</p>
            </div>
          </div>
        </section>

        {/* Categorías de compra rápidas */}
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-3 px-1">
            Categorías frecuentes
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { emoji: '🥬', label: 'Comida' },
              { emoji: '🧹', label: 'Limpieza' },
              { emoji: '💊', label: 'Salud' },
              { emoji: '🎮', label: 'Varios' },
            ].map((category, idx) => (
              <button
                key={idx}
                className="bg-white p-3 rounded-xl border border-neutral-200 hover:shadow-md active:scale-95 transition-all"
              >
                <div className="text-2xl mb-2 text-center">{category.emoji}</div>
                <p className="text-xs font-medium text-neutral-700 text-center">
                  {category.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Consejo */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 text-sm mb-1">
                Consejo de ahorro
              </h3>
              <p className="text-sm text-emerald-700">
                Revisa tus gastos semanalmente para identificar áreas de ahorro.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
