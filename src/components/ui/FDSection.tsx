import React from "react";
import { View, ViewStyle, Pressable, StyleSheet } from "react-native";
import { theme } from "@/theme/theme";
import { FDText } from "./FDText";

export type FDSectionProps = {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function FDSection({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  children,
  style,
}: FDSectionProps) {
  return (
    <View style={[styles.wrap, style]}>
      {(title || actionLabel) ? (
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            {title ? <FDText variant="h2">{title}</FDText> : null}
            {subtitle ? <FDText tone="secondary">{subtitle}</FDText> : null}
          </View>

          {actionLabel && onActionPress ? (
            <Pressable
              onPress={onActionPress}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <FDText tone="secondary" style={styles.actionText}>
                {actionLabel}
              </FDText>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.md, // 12
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionText: {
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.primary,
  },
  body: {
    gap: theme.spacing.md,
  },
});

