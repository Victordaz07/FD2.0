import React from "react";
import { View } from "react-native";
import { theme } from "@/theme/theme";
import { FDScreen, FDText, FDSection, FDCard, FDButton, FDListItem, FDStatPill, FDBadge } from "@/components/ui";

export function HomeRedesigned() {
  return (
    <FDScreen scroll>
      <FDText variant="h1">Hoy</FDText>
      <FDText tone="secondary">Lo importante, sin ruido.</FDText>

      <View style={{ height: theme.spacing.xl }} />

      {/* Stats Row */}
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <FDStatPill label="Tareas hoy" value={3} tone="primary" />
        </View>
        <View style={{ flex: 1 }}>
          <FDStatPill label="Eventos" value={1} tone="accent" />
        </View>
      </View>

      <View style={{ height: theme.spacing.xl }} />

      {/* Highlight / motivación (simple por ahora) */}
      <FDCard style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.primaryBg }}>
        <FDText variant="h2">🎉 Buena racha</FDText>
        <FDText tone="secondary">Completa 1 tarea más y mantienes la consistencia de hoy.</FDText>

        <View style={{ height: theme.spacing.md }} />
        <FDButton label="Agregar tarea" onPress={() => {}} />
      </FDCard>

      <View style={{ height: theme.spacing["2xl"] }} />

      {/* Próximas tareas */}
      <FDSection title="Próximas tareas" actionLabel="Ver todas" onActionPress={() => {}}>
        <FDListItem
          title="Lavar platos"
          subtitle="Asignado a: Noah • vence hoy"
          right={<FDBadge label="Hoy" tone="warning" />}
        />
        <FDListItem
          title="Ordenar habitación"
          subtitle="Asignado a: Ariella • vence mañana"
          right={<FDBadge label="Mañana" tone="primary" />}
        />
        <FDListItem
          title="Leer 15 min"
          subtitle="Asignado a: Todos • hábito"
          right={<FDBadge label="Hábito" tone="success" />}
        />
      </FDSection>

      <View style={{ height: theme.spacing["2xl"] }} />

      {/* Acciones rápidas */}
      <FDSection title="Acciones rápidas">
        <View style={{ gap: theme.spacing.sm }}>
          <FDButton label="Crear evento" variant="secondary" onPress={() => {}} />
          <FDButton label="Ver progreso" variant="secondary" onPress={() => {}} />
        </View>
      </FDSection>
    </FDScreen>
  );
}

