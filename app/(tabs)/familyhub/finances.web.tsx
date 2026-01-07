/**
 * Finances - Pantalla de finanzas
 * Tabs: Gastos, Ahorros, Mesadas
 * Cards resumen: metas activas (verde), gastos mes (rojo)
 */

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet } from "lucide-react";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { SummaryCard } from "@/components/familyhub/SummaryCard";
import { ListCard } from "@/components/familyhub/ListCard";
import { EmptyState } from "@/components/familyhub/EmptyState";
import { SheetFormLayout } from "@/components/familyhub/SheetFormLayout";
import { FormField } from "@/components/familyhub/FormField";
import { SelectField } from "@/components/familyhub/SelectField";
import { Toast } from "@/components/familyhub/Toast";
import { cn } from "@/components/ui/utils";

type FinanceTab = 'expenses' | 'savings' | 'allowances';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
  assignedTo: string;
}

interface SavingsGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  participants: string[];
}

interface Allowance {
  id: string;
  member: string;
  amount: number;
  frequency: string;
  nextDate: string;
}

function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('expenses');
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [showSavingsSheet, setShowSavingsSheet] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success' as const, message: '' });
  
  // Mock data
  const expenses: Transaction[] = [
    { id: '1', title: 'Supermercado', amount: 1200, category: 'Alimentación', date: '2026-01-05', type: 'expense', assignedTo: 'Mamá' },
    { id: '2', title: 'Gasolina', amount: 600, category: 'Transporte', date: '2026-01-04', type: 'expense', assignedTo: 'Papá' },
  ];
  
  const savings: SavingsGoal[] = [
    { id: '1', title: 'Vacaciones familiares', current: 8500, target: 15000, participants: ['__all__'] },
    { id: '2', title: 'Fondo de emergencia', current: 12000, target: 20000, participants: ['__all__'] },
  ];
  
  const allowances: Allowance[] = [
    { id: '1', member: 'Emma', amount: 100, frequency: 'Semanal', nextDate: '2026-01-08' },
    { id: '2', member: 'Jake', amount: 80, frequency: 'Semanal', nextDate: '2026-01-08' },
  ];
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeSavingsGoals = savings.length;
  
  const handleSaveExpense = () => {
    setShowExpenseSheet(false);
    setToast({ show: true, type: 'success', message: 'Gasto registrado exitosamente' });
  };
  
  const handleSaveSavings = () => {
    setShowSavingsSheet(false);
    setToast({ show: true, type: 'success', message: 'Meta de ahorro creada' });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-20">
      <AppHeader 
        title="Finanzas" 
        subtitle="Control de gastos familiares"
        onAddClick={() => {
          if (activeTab === 'expenses') setShowExpenseSheet(true);
          if (activeTab === 'savings') setShowSavingsSheet(true);
        }}
      />

      <main className="max-w-[390px] mx-auto px-5 py-5 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Gastos del mes"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            variant="error"
          />
          
          <SummaryCard
            title="Metas activas"
            value={activeSavingsGoals}
            subtitle="En progreso"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-neutral-200">
          {[
            { id: 'expenses', label: 'Gastos' },
            { id: 'savings', label: 'Ahorros' },
            { id: 'allowances', label: 'Mesadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FinanceTab)}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Gastos */}
        {activeTab === 'expenses' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Gastos recientes</h2>
            
            {expenses.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="Sin gastos"
                description="No hay gastos registrados este mes"
                actionLabel="Registrar gasto"
                onAction={() => setShowExpenseSheet(true)}
              />
            ) : (
              expenses.map((expense) => (
                <ListCard
                  key={expense.id}
                  title={expense.title}
                  subtitle={`${expense.category} • ${new Date(expense.date).toLocaleDateString('es-ES')}`}
                  leftContent={
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-rose-600" strokeWidth={2.5} />
                    </div>
                  }
                  rightContent={
                    <div className="text-right">
                      <p className="font-semibold text-rose-600">-${expense.amount}</p>
                      <p className="text-xs text-neutral-500">{expense.assignedTo}</p>
                    </div>
                  }
                  onClick={() => setShowExpenseSheet(true)}
                  showChevron
                />
              ))
            )}
          </div>
        )}

        {/* Tab Content: Ahorros */}
        {activeTab === 'savings' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Metas de ahorro</h2>
            
            {savings.length === 0 ? (
              <EmptyState
                icon={PiggyBank}
                title="Sin metas"
                description="Crea metas de ahorro familiares"
                actionLabel="Crear meta"
                onAction={() => setShowSavingsSheet(true)}
              />
            ) : (
              savings.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                
                return (
                  <div key={goal.id} className="bg-white p-4 rounded-2xl border border-neutral-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{goal.title}</h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          ${goal.current.toLocaleString()} de ${goal.target.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content: Mesadas */}
        {activeTab === 'allowances' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">Mesadas programadas</h2>
            
            {allowances.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="Sin mesadas"
                description="Configura mesadas automáticas"
                actionLabel="Configurar mesada"
                onAction={() => {}}
              />
            ) : (
              allowances.map((allowance) => (
                <ListCard
                  key={allowance.id}
                  title={allowance.member}
                  subtitle={`${allowance.frequency} • Próximo: ${new Date(allowance.nextDate).toLocaleDateString('es-ES')}`}
                  leftContent={
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                    </div>
                  }
                  rightContent={
                    <p className="font-semibold text-amber-600">${allowance.amount}</p>
                  }
                  showChevron
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Sheet: Registrar Gasto */}
      <SheetFormLayout
        isOpen={showExpenseSheet}
        onClose={() => setShowExpenseSheet(false)}
        title="Registrar gasto"
        description="Añade un nuevo gasto familiar"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowExpenseSheet(false)}
              className="flex-1 h-12 rounded-xl border-2 border-neutral-200 font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveExpense}
              className="flex-1 h-12 rounded-xl font-medium text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: '#4F46E5' }}
            >
              Guardar
            </button>
          </div>
        }
      >
        <FormField label="Concepto" placeholder="Ej: Supermercado" />
        
        <FormField label="Monto" type="number" placeholder="0.00" />
        
        <SelectField label="Categoría">
          <option value="">Seleccionar...</option>
          <option value="food">Alimentación</option>
          <option value="transport">Transporte</option>
          <option value="education">Educación</option>
          <option value="health">Salud</option>
          <option value="entertainment">Entretenimiento</option>
          <option value="other">Otros</option>
        </SelectField>
        
        <SelectField label="Pagado por">
          <option value="__all__">Toda la familia</option>
          <option value="mom">Mamá</option>
          <option value="dad">Papá</option>
        </SelectField>
        
        <FormField label="Fecha" type="date" />
      </SheetFormLayout>

      {/* Sheet: Meta de Ahorro */}
      <SheetFormLayout
        isOpen={showSavingsSheet}
        onClose={() => setShowSavingsSheet(false)}
        title="Nueva meta de ahorro"
        description="Define una meta de ahorro familiar"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowSavingsSheet(false)}
              className="flex-1 h-12 rounded-xl border-2 border-neutral-200 font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveSavings}
              className="flex-1 h-12 rounded-xl font-medium text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: '#10B981' }}
            >
              Crear meta
            </button>
          </div>
        }
      >
        <FormField label="Nombre de la meta" placeholder="Ej: Vacaciones 2026" />
        
        <FormField label="Meta ($)" type="number" placeholder="15000" />
        
        <FormField label="Ahorro actual ($)" type="number" placeholder="0" />
        
        <SelectField label="Participantes">
          <option value="__all__">Toda la familia</option>
          <option value="parents">Solo padres</option>
          <option value="custom">Personalizado...</option>
        </SelectField>
        
        <FormField label="Fecha límite (opcional)" type="date" />
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



export default Finances;

;