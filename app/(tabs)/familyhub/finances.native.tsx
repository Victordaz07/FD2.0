import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { SummaryCard } from "@/components/familyhub/SummaryCard";
import { ListCard } from "@/components/familyhub/ListCard";
import { SheetFormLayout } from "@/components/familyhub/SheetFormLayout";
import { FormField } from "@/components/familyhub/FormField";
import { SelectField } from "@/components/familyhub/SelectField";
import { Toast, ToastType } from "@/components/familyhub/Toast";

type FinanceTab = "expenses" | "savings" | "allowances";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: "expense" | "income";
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

export default function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("expenses");
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [showSavingsSheet, setShowSavingsSheet] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: ToastType; message: string }>({
    show: false,
    type: "success",
    message: "",
  });

  const expenses: Transaction[] = [
    { id: "1", title: "Supermercado", amount: 1200, category: "Alimentación", date: "2026-01-05", type: "expense", assignedTo: "Mamá" },
    { id: "2", title: "Gasolina", amount: 600, category: "Transporte", date: "2026-01-04", type: "expense", assignedTo: "Papá" },
  ];

  const savings: SavingsGoal[] = [
    { id: "1", title: "Vacaciones familiares", current: 8500, target: 15000, participants: ["Familia"] },
    { id: "2", title: "Fondo de emergencia", current: 12000, target: 20000, participants: ["Familia"] },
  ];

  const allowances: Allowance[] = [
    { id: "1", member: "Emma", amount: 100, frequency: "Semanal", nextDate: "2026-01-08" },
    { id: "2", member: "Jake", amount: 80, frequency: "Semanal", nextDate: "2026-01-08" },
  ];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeSavingsGoals = savings.length;

  const handleSaveExpense = () => {
    setShowExpenseSheet(false);
    setToast({ show: true, type: "success", message: "Gasto registrado exitosamente" });
  };

  const handleSaveSavings = () => {
    setShowSavingsSheet(false);
    setToast({ show: true, type: "success", message: "Meta de ahorro creada" });
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Finanzas"
        subtitle="Control de gastos familiares"
        onAddClick={() => {
          if (activeTab === "expenses") setShowExpenseSheet(true);
          if (activeTab === "savings") setShowSavingsSheet(true);
        }}
      />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.grid2}>
          <SummaryCard
            title="Gastos del mes"
            value={`$${totalExpenses.toLocaleString()}`}
            icon="trending-down"
            variant="error"
          />
          <SummaryCard
            title="Metas activas"
            value={activeSavingsGoals}
            subtitle="En progreso"
            icon="trending-up"
            variant="success"
          />
        </View>

        <View style={styles.tabs}>
          {[
            { id: "expenses", label: "Gastos" },
            { id: "savings", label: "Ahorros" },
            { id: "allowances", label: "Mesadas" },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id as FinanceTab)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "expenses" && (
          <View style={{ gap: 12 }}>
            {expenses.map((expense) => (
              <ListCard
                key={expense.id}
                title={expense.title}
                subtitle={`${expense.category} • ${expense.date}`}
                rightContent={
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "700", color: "#DC2626" }}>
                      -${expense.amount.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>{expense.assignedTo}</Text>
                  </View>
                }
                showChevron
              />
            ))}
          </View>
        )}

        {activeTab === "savings" && (
          <View style={{ gap: 12 }}>
            {savings.map((goal) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <View key={goal.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{goal.title}</Text>
                  <Text style={styles.cardMeta}>
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${percent}%` }]} />
                  </View>
                  <Text style={styles.cardMeta}>{percent}% completado</Text>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "allowances" && (
          <View style={{ gap: 12 }}>
            {allowances.map((a) => (
              <ListCard
                key={a.id}
                title={a.member}
                subtitle={`Próximo: ${a.nextDate}`}
                rightContent={
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "700", color: "#111827" }}>
                      ${a.amount}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>{a.frequency}</Text>
                  </View>
                }
                showChevron
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SheetFormLayout
        isOpen={showExpenseSheet}
        onClose={() => setShowExpenseSheet(false)}
        title="Nuevo gasto"
        description="Registra un gasto familiar"
        footer={
          <Pressable style={styles.primaryButton} onPress={handleSaveExpense}>
            <Text style={styles.primaryText}>Guardar gasto</Text>
          </Pressable>
        }
      >
        <View style={{ gap: 12 }}>
          <FormField label="Concepto" placeholder="Supermercado" />
          <FormField label="Monto" placeholder="$0" keyboardType="numeric" />
          <FormField label="Fecha" placeholder="YYYY-MM-DD" />
          <SelectField label="Categoría" placeholder="Seleccionar">
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
          </SelectField>
        </View>
      </SheetFormLayout>

      <SheetFormLayout
        isOpen={showSavingsSheet}
        onClose={() => setShowSavingsSheet(false)}
        title="Nueva meta de ahorro"
        description="Configura una meta familiar"
        footer={
          <Pressable style={styles.primaryButton} onPress={handleSaveSavings}>
            <Text style={styles.primaryText}>Crear meta</Text>
          </Pressable>
        }
      >
        <View style={{ gap: 12 }}>
          <FormField label="Título" placeholder="Vacaciones familiares" />
          <FormField label="Monto objetivo" placeholder="$0" keyboardType="numeric" />
        </View>
      </SheetFormLayout>

      <Toast
        isVisible={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  grid2: { flexDirection: "row", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  tabs: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 6,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#EEF2FF",
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#4F46E5" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 8,
  },
  cardTitle: { fontWeight: "700", color: "#111827", fontSize: 16 },
  cardMeta: { color: "#6B7280", fontSize: 13 },
  progressBar: {
    height: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#10B981",
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});

