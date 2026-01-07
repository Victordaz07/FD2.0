import React, { useMemo } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/theme/theme";
import {
  FDScreen,
  FDText,
  FDSection,
  FDStatPill,
  FDListItem,
  FDCard,
  FDButton,
  FDBadge,
} from "@/components/ui";

function formatDateLong(d: Date) {
  try {
    return d.toLocaleDateString("es-ES", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d.toDateString();
  }
}

export default function PlanScreen() {
  const router = useRouter();

  // ===============================
  // LÓGICA REAL (preservada)
  // ===============================
  const handleNavigate = (route: string) => {
    switch (route) {
      case "tasks":
        try {
          router.push("/(tabs)/tasks" as any);
        } catch (e) {
          console.error("Navigation error to tasks:", e);
        }
        break;
      case "goals":
        // Por ahora mostrar alerta hasta que se implemente
        // router.push("/(tabs)/goals" as any);
        break;
      case "calendar":
        try {
          router.push("/(tabs)/familyhub/calendar" as any);
        } catch (e) {
          console.error("Navigation error to calendar:", e);
        }
        break;
      default:
        break;
    }
  };

  // ===============================
  // Header
  // ===============================
  const today = useMemo(() => new Date(), []);
  const dateLabel = useMemo(() => formatDateLong(today), [today]);

  // ===============================
  // Stats (usar data real si existe)
  // ===============================
  const pendingCount = 8; // TODO: conectar a store real
  const completedCount = 2; // TODO: conectar a store real
  const todayEvents = 12; // TODO: conectar a store real
  const dayPoints = 120; // TODO: conectar a store real

  // ===============================
  // Navegaciones
  // ===============================
  const goAddTask = () => {
    try {
      router.push("/(tabs)/tasks" as any);
    } catch (e) {
      console.error("Navigation error (add task):", e);
    }
  };

  const goLegacy = () => {
    try {
      router.push("/legacy-plan");
    } catch (e) {
      console.error("Navigation error (legacy plan):", e);
    }
  };

  return (
    <FDScreen scroll>
      {/* Header */}
      <FDText variant="h1">Plan</FDText>
      <FDText tone="secondary" style={{ textTransform: "capitalize" }}>
        {dateLabel}
      </FDText>

      <View style={{ height: theme.spacing.xl }} />

      {/* Resumen */}
      <FDSection title="Hoy">
        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <FDStatPill label="Pendientes" value={pendingCount} tone="warning" />
          </View>
          <View style={{ flex: 1 }}>
            <FDStatPill label="Completadas" value={completedCount} tone="success" />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <FDStatPill label="Eventos hoy" value={todayEvents} tone="accent" />
          </View>
          <View style={{ flex: 1 }}>
            <FDStatPill label="Puntos" value={dayPoints} tone="secondary" />
          </View>
        </View>
      </FDSection>

      <View style={{ height: theme.spacing["2xl"] }} />

      {/* Tareas de hoy */}
      <FDSection
        title="Tareas de hoy"
        actionLabel="Agregar"
        onActionPress={goAddTask}
      >
        <FDListItem
          title="Lavar platos"
          subtitle="Asignado a: Familiar • vence hoy"
          right={<FDBadge label="Hoy" tone="warning" />}
          onPress={goAddTask}
        />
        <FDListItem
          title="Leer 15 min"
          subtitle="Asignado a: Familiar"
          right={<FDBadge label="Hábito" tone="primary" />}
        />
      </FDSection>

      <View style={{ height: theme.spacing["2xl"] }} />

      {/* Completadas */}
      <FDSection title="Completadas" actionLabel="Ver todo">
        <FDListItem
          title="Ordenar habitación"
          subtitle="Completada hoy"
          right={<FDBadge label="Hecho" tone="success" />}
        />
      </FDSection>

      <View style={{ height: theme.spacing["2xl"] }} />

      {/* CTA */}
      <FDCard
        style={{
          backgroundColor: theme.colors.primaryBg,
          borderColor: theme.colors.primaryBg,
        }}
      >
        <FDText variant="h2">💪 Sigue así</FDText>
        <FDText tone="secondary">
          Cada tarea completada fortalece el hábito familiar.
        </FDText>

        <View style={{ height: theme.spacing.lg }} />

        <FDButton label="Agregar tarea" onPress={goAddTask} />

        <View style={{ height: theme.spacing.sm }} />

        <FDButton
          label="Ver Plan viejo"
          variant="secondary"
          onPress={goLegacy}
        />
      </FDCard>

      <View style={{ height: theme.spacing["3xl"] }} />
    </FDScreen>
  );
}
