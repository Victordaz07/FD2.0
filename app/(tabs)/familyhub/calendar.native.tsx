import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ListCard } from "@/components/familyhub/ListCard";
import { SheetFormLayout } from "@/components/familyhub/SheetFormLayout";
import { FormField } from "@/components/familyhub/FormField";
import { SelectField } from "@/components/familyhub/SelectField";
import { Toast, ToastType } from "@/components/familyhub/Toast";
import { Ionicons } from "@expo/vector-icons";

type ViewMode = "day" | "week" | "month";
type EventType = "task" | "goal" | "event";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  assignedTo: string;
}

const eventTypeColors = {
  task: { bg: "#EFF6FF", border: "#3B82F6", text: "#1E40AF" },
  goal: { bg: "#FAF5FF", border: "#A855F7", text: "#7E22CE" },
  event: { bg: "#EEF2FF", border: "#6366F1", text: "#4338CA" },
};

const eventTypeLabels = {
  task: "Tarea",
  goal: "Meta",
  event: "Evento",
};

export default function Calendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: ToastType; message: string }>({
    show: false,
    type: "success",
    message: "",
  });

  const events: CalendarEvent[] = [
    { id: "1", title: "Comprar despensa", type: "task", date: "2026-01-06", time: "10:00", assignedTo: "Mamá" },
    { id: "2", title: "Leer 10 libros", type: "goal", date: "2026-01-06", assignedTo: "__all__" },
    { id: "3", title: "Reunión familiar", type: "event", date: "2026-01-06", time: "18:00", assignedTo: "__all__" },
  ];

  const filteredEvents = useMemo(() => events, [events]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() - 1);
    if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + 1);
    if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleSaveEvent = () => {
    setShowEventSheet(false);
    setToast({ show: true, type: "success", message: "Evento creado exitosamente" });
  };

  const formattedMonth = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const formattedDay = currentDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric" });

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Calendario"
        subtitle="Organiza actividades familiares"
        onAddClick={() => setShowEventSheet(true)}
      />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.card}>
          <View style={styles.dateRow}>
            <Pressable style={styles.iconButton} onPress={handlePrev}>
              <Ionicons name="chevron-back" size={18} color="#4B5563" />
            </Pressable>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.month}>{formattedMonth}</Text>
              <Text style={styles.day}>{formattedDay}</Text>
            </View>
            <Pressable style={styles.iconButton} onPress={handleNext}>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </Pressable>
          </View>

          <View style={styles.tabs}>
            {[
              { id: "day", label: "Día" },
              { id: "week", label: "Semana" },
              { id: "month", label: "Mes" },
            ].map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setViewMode(tab.id as ViewMode)}
                style={[
                  styles.tab,
                  viewMode === tab.id && styles.tabActive,
                ]}
              >
                <Text style={[styles.tabText, viewMode === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos del día</Text>
          {filteredEvents.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin eventos</Text>
              <Text style={styles.emptyText}>Agrega un evento para empezar.</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {filteredEvents.map((event) => {
                const colors = eventTypeColors[event.type];
                return (
                  <ListCard
                    key={event.id}
                    title={event.title}
                    subtitle={`${eventTypeLabels[event.type]} • ${event.time || "Todo el día"}`}
                    leftContent={
                      <View style={[styles.eventIcon, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                        <Ionicons
                          name={event.type === "task" ? "checkbox-outline" : event.type === "goal" ? "trophy" : "calendar"}
                          size={18}
                          color={colors.text}
                        />
                      </View>
                    }
                    rightContent={
                      <Text style={[styles.eventChip, { color: colors.text, borderColor: colors.border }]}>
                        {event.assignedTo === "__all__" ? "Familia" : event.assignedTo}
                      </Text>
                    }
                    showChevron
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <SheetFormLayout
        isOpen={showEventSheet}
        onClose={() => setShowEventSheet(false)}
        title="Nuevo evento"
        description="Crea una actividad para el calendario"
        footer={
          <Pressable style={styles.primaryButton} onPress={handleSaveEvent}>
            <Text style={styles.primaryText}>Guardar</Text>
          </Pressable>
        }
      >
        <View style={{ gap: 12 }}>
          <FormField label="Título" placeholder="Ej: Comprar despensa" />
          <SelectField
            label="Tipo"
            placeholder="Seleccionar"
            onValueChange={() => {}}
          >
            <option value="task">Tarea</option>
            <option value="goal">Meta</option>
            <option value="event">Evento</option>
          </SelectField>
          <FormField label="Fecha" placeholder="YYYY-MM-DD" />
          <FormField label="Hora" placeholder="10:00" />
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  month: { fontSize: 16, fontWeight: "700", color: "#111827" },
  day: { fontSize: 14, color: "#6B7280", textTransform: "capitalize" },
  tabs: { flexDirection: "row", gap: 8 },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  tabActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
  },
  tabText: { fontWeight: "600", color: "#4B5563" },
  tabTextActive: { color: "#4F46E5" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  empty: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { fontWeight: "700", color: "#111827" },
  emptyText: { color: "#6B7280" },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eventChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});

