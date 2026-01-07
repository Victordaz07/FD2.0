import React from "react";
import { View } from "react-native";
import { FDScreen, FDText, FDCard, FDButton, FDBadge } from "@/components/ui";
import { theme } from "@/theme/theme";

export function ThemeTest() {
  return (
    <FDScreen scroll>
      <FDText variant="h1">FamilyDash UI</FDText>

      <View style={{ height: theme.spacing.xl }} />

      <FDCard>
        <FDText variant="h2">Card estándar</FDText>
        <FDText tone="secondary">Todo consistente, sin gritar.</FDText>

        <View style={{ marginTop: theme.spacing.md }}>
          <FDBadge label="Nuevo" />
        </View>

        <View style={{ marginTop: theme.spacing.lg }}>
          <FDButton label="Continuar" onPress={() => {}} />
          <View style={{ height: theme.spacing.sm }} />
          <FDButton label="Cancelar" variant="secondary" onPress={() => {}} />
        </View>
      </FDCard>
    </FDScreen>
  );
}

