import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { HubCard } from "@/components/familyhub/HubCard";

export default function PlanLegacy() {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    switch (route) {
      case "tasks":
        router.push("/(tabs)/tasks" as any);
        break;
      case "goals":
        // Por ahora mostrar alerta hasta que se implemente
        // router.push("/(tabs)/goals" as any);
        break;
      case "calendar":
        router.push("/(tabs)/familyhub/calendar" as any);
        break;
      default:
        break;
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Plan</Text>
        <Text style={styles.subtitle}>Organiza tareas, metas y eventos</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.cardsContainer}>
          <HubCard
            icon="checkbox"
            title="Tareas"
            description="Gestiona las actividades diarias"
            value="8"
            badge="pendientes"
            color="blue"
            onClick={() => handleNavigate("tasks")}
          />

          <HubCard
            icon="flag"
            title="Metas"
            description="Objetivos familiares a largo plazo"
            progress={65}
            color="purple"
            onClick={() => handleNavigate("goals")}
          />

          <HubCard
            icon="calendar"
            title="Calendario"
            description="Visualiza y programa eventos"
            value="12"
            badge="este mes"
            color="emerald"
            onClick={() => handleNavigate("calendar")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  cardsContainer: {
    gap: 0, // Sin gap entre cards para que se vean más juntas
  },
});

