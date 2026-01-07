import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { HubCard } from "@/components/familyhub/HubCard";

type Navigate = (subRoute: string) => void;

interface HouseProps {
  onNavigate?: Navigate;
}

export default function House({ onNavigate }: HouseProps) {
  const categories = [
    { emoji: "🥬", label: "Comida" },
    { emoji: "🧹", label: "Limpieza" },
    { emoji: "💊", label: "Salud" },
    { emoji: "🎮", label: "Varios" },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Hogar</Text>
        <Text style={styles.subtitle}>Gestiona compras y finanzas</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <HubCard
          icon="cart"
          title="Compras"
          description="Listas de compras organizadas"
          value="12"
          badge="items pendientes"
          color="emerald"
          onClick={() => onNavigate?.("shopping")}
        />

        <HubCard
          icon="cash"
          title="Finanzas"
          description="Control de gastos y ahorros"
          value="$2,400"
          badge="gastos del mes"
          color="blue"
          onClick={() => onNavigate?.("finances")}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del mes</Text>
          <View style={styles.grid2}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.iconSmall}>
                  <Text style={{ color: "#E11D48" }}>▼</Text>
                </View>
                <Text style={styles.statLabel}>Gastos</Text>
              </View>
              <Text style={styles.statValue}>$2,400</Text>
              <Text style={styles.statMeta}>15 transacciones</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.iconSmall, { backgroundColor: "#D1FAE5" }]}>
                  <Text style={{ color: "#059669" }}>▲</Text>
                </View>
                <Text style={styles.statLabel}>Ahorros</Text>
              </View>
              <Text style={styles.statValue}>$8,500</Text>
              <Text style={styles.statMeta}>2 metas activas</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías frecuentes</Text>
          <View style={styles.grid4}>
            {categories.map((category, idx) => (
              <View key={idx} style={styles.catCard}>
                <Text style={styles.catEmoji}>{category.emoji}</Text>
                <Text style={styles.catLabel}>{category.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 22 }}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Consejo de ahorro</Text>
              <Text style={styles.tipText}>
                Revisa tus gastos semanalmente para identificar áreas de ahorro.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  grid2: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 6,
  },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 12, color: "#4B5563" },
  statValue: { fontSize: 20, fontWeight: "700", color: "#111827" },
  statMeta: { fontSize: 12, color: "#6B7280" },
  grid4: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catCard: {
    width: "23%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  catEmoji: { fontSize: 22 },
  catLabel: { fontSize: 12, fontWeight: "600", color: "#374151", textAlign: "center" },
  tipCard: {
    backgroundColor: "#ECFDF3",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  tipTitle: { fontWeight: "700", color: "#065F46", fontSize: 14 },
  tipText: { color: "#047857", fontSize: 13, marginTop: 2 },
});

