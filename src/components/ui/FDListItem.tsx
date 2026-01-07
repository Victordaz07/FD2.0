import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { theme } from "@/theme/theme";
import { FDText } from "./FDText";

export type FDListItemProps = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;   // icono o avatar
  right?: React.ReactNode;  // chevron / badge / switch
  onPress?: () => void;
  style?: ViewStyle;
};

export function FDListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  style,
}: FDListItemProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress as any}
      style={({ pressed }: any) => [
        styles.row,
        { opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}

      <View style={styles.mid}>
        <FDText variant="h3">{title}</FDText>
        {subtitle ? <FDText tone="secondary">{subtitle}</FDText> : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.base,
    gap: theme.spacing.md,
  },
  left: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.muted,
  },
  mid: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", justifyContent: "center" },
});

