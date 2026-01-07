import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "@/theme/theme";
import { FDText } from "./FDText";

type Tone = "primary" | "secondary" | "accent" | "success" | "warning";
type Variant = "soft" | "solid";

export type FDStatPillProps = {
  label: string;
  value: string | number;
  tone?: Tone;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function FDStatPill({
  label,
  value,
  tone = "primary",
  variant = "soft",
  leftIcon,
  style,
}: FDStatPillProps) {
  const cfg = useMemo(() => {
    const softMap: Record<Tone, { bg: string; fg: string; value: string }> = {
      accent: { bg: theme.colors.accentBg, fg: theme.colors.accent, value: theme.colors.textPrimary },
      success: { bg: theme.colors.successLight, fg: theme.colors.success, value: theme.colors.textPrimary },
      warning: { bg: theme.colors.warningLight, fg: theme.colors.warning, value: theme.colors.textPrimary },
      secondary: { bg: theme.colors.secondaryBg, fg: theme.colors.secondary, value: theme.colors.textPrimary },
      primary: { bg: theme.colors.primaryBg, fg: theme.colors.primaryDark, value: theme.colors.textPrimary },
    };

    const solidMap: Record<Tone, { bg: string; fg: string; value: string }> = {
      accent: { bg: theme.colors.hubBlue, fg: theme.colors.hubStatSubtext, value: theme.colors.hubStatText },
      success: { bg: theme.colors.hubGreen, fg: theme.colors.hubStatSubtext, value: theme.colors.hubStatText },
      warning: { bg: theme.colors.hubOrange, fg: theme.colors.hubStatSubtext, value: theme.colors.hubStatText },
      secondary: { bg: theme.colors.hubPurple, fg: theme.colors.hubStatSubtext, value: theme.colors.hubStatText },
      primary: { bg: theme.colors.primary, fg: theme.colors.hubStatSubtext, value: theme.colors.hubStatText },
    };

    return variant === "solid" ? solidMap[tone] : softMap[tone];
  }, [tone, variant]);

  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }, style]}>
      {leftIcon ? (
        <View style={[styles.icon, variant === "solid" && styles.iconSolid]}>
          {leftIcon}
        </View>
      ) : null}

      <View style={styles.textContainer}>
        <FDText variant="small" style={{ color: cfg.fg || theme.colors.textSecondary }}>
          {label}
        </FDText>
        <FDText variant="h3" style={{ color: cfg.value || theme.colors.textPrimary }}>
          {String(value)}
        </FDText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
  },
  iconSolid: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  textContainer: {
    gap: 2,
  },
});

