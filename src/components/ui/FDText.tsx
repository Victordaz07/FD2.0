import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { theme } from "@/theme/theme";

type Variant = "h1" | "h2" | "h3" | "body" | "caption" | "small";
type Tone = "primary" | "secondary" | "tertiary" | "onColor";

export type FDTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function FDText({
  variant = "body",
  tone = "primary",
  style,
  ...props
}: FDTextProps) {
  return (
    <Text
      {...props}
      style={[styles.base, styles[variant], { color: theme.typography.color[tone] }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { fontFamily: theme.typography.fontFamily },

  h1: {
    fontSize: theme.typography.xl,
    lineHeight: theme.typography.lineHeight.xl,
    fontWeight: theme.typography.weight.semibold,
  },
  h2: {
    fontSize: theme.typography.lg,
    lineHeight: theme.typography.lineHeight.lg,
    fontWeight: theme.typography.weight.semibold,
  },
  h3: {
    fontSize: theme.typography.base,
    lineHeight: theme.typography.lineHeight.base,
    fontWeight: theme.typography.weight.semibold,
  },
  body: {
    fontSize: theme.typography.base,
    lineHeight: theme.typography.lineHeight.base,
    fontWeight: theme.typography.weight.normal,
  },
  caption: {
    fontSize: theme.typography.sm,
    lineHeight: theme.typography.lineHeight.sm,
    fontWeight: theme.typography.weight.medium,
  },
  small: {
    fontSize: theme.typography.xs,
    lineHeight: theme.typography.lineHeight.xs,
    fontWeight: theme.typography.weight.medium,
  },
});

