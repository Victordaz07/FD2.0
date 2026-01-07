import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { theme } from "@/theme/theme";

export type FDCardProps = ViewProps & {
  padded?: boolean;
  borderless?: boolean;
};

export function FDCard({
  padded = true,
  borderless = false,
  style,
  ...props
}: FDCardProps) {
  return (
    <View
      {...props}
      style={[
        styles.card,
        padded && styles.padded,
        borderless && styles.borderless,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg, // 16
  },
  padded: {
    padding: theme.layout.cardPadding,
  },
  borderless: {
    borderWidth: 0,
  },
});

