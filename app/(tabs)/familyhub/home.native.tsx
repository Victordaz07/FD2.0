import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { StatsCard } from "@/components/familyhub/StatsCard";
import { Ionicons } from "@expo/vector-icons";

type HomeNav = (tab: string, subRoute?: string) => void;

interface HomeProps {
  onNavigate?: HomeNav;
}

export default function Home({ onNavigate }: HomeProps) {
  const { greeting, currentDate } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? "¡Buenos días!" : hour < 18 ? "¡Buenas tardes!" : "¡Buenas noches!";
    const currentDate = now.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return { greeting, currentDate };
  }, []);

  const recent = [
    { id: "1", title: 'Emma completó "Hacer la tarea"', meta: "Hace 2 horas • +50 puntos" },
    { id: "2", title: 'Papá programó "Revisión médica"', meta: "Ayer • Evento" },
    { id: "3", title: "Mamá creó meta: Leer 10 libros", meta: "Ayer • Meta familiar" },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen rápido</Text>
          <View style={styles.grid2}>
            <StatsCard
              emoji="🔥"
              title="Racha familiar"
              value="15 días"
              subtitle="¡Sigan así!"
              color="amber"
              onClick={() => onNavigate?.("family")}
            />
            <StatsCard
              icon="checkbox"
              title="Pendientes"
              value="8"
              subtitle="tareas hoy"
              color="blue"
              onClick={() => onNavigate?.("plan", "tasks")}
            />
            <StatsCard
              icon="calendar"
              title="Próximos"
              value="3"
              subtitle="eventos"
              color="purple"
              onClick={() => onNavigate?.("plan", "calendar")}
            />
            <StatsCard
              icon="trophy"
              title="Puntos"
              value="4,250"
              subtitle="familia"
              color="emerald"
              onClick={() => onNavigate?.("family")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <Pressable>
              <Text style={styles.link}>Ver todo</Text>
            </Pressable>
          </View>

          <View style={styles.listSpace}>
            {recent.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardIcon}>
                  <Ionicons name="checkmark-done" size={18} color="#059669" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.meta}</Text>
                </View>
              </View>
            ))}
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
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22 },
  headerText: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: "700", color: "#111827" },
  date: { fontSize: 14, color: "#6B7280", textTransform: "capitalize" },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  link: { color: "#4F46E5", fontWeight: "600", fontSize: 14 },
  grid2: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  listSpace: { gap: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ECFDF3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  cardMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});

