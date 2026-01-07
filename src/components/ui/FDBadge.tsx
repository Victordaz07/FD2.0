import React, { useMemo } from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { theme } from "@/theme/theme";
import { FDText } from "./FDText";

type BadgeTone = "primary" | "success" | "warning" | "destructive" | "secondary";

export type FDBadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
};

export function FDBadge({ label, tone = "primary", style, ...props }: FDBadgeProps) {
  const cfg = useMemo(() => {
    switch (tone) {
      case "success":
        return { bg: theme.colors.successLight, fg: theme.colors.success };
      case "warning":
        return { bg: theme.colors.warningLight, fg: theme.colors.warning };
      case "destructive":
        return { bg: theme.colors.destructiveLight, fg: theme.colors.destructive };
      case "secondary":
        return { bg: theme.colors.secondaryBg, fg: theme.colors.secondary };
      default:
        return { bg: theme.colors.primaryBg, fg: theme.colors.primaryDark };
    }
  }, [tone]);

  return (
    <View {...props} style={[styles.base, { backgroundColor: cfg.bg }, style]}>
      <FDText variant="small" style={[styles.text, { color: cfg.fg }]} numberOfLines={1}>
        {label}
      </FDText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.sm, // 8
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontWeight: theme.typography.weight.medium,
  },
});

