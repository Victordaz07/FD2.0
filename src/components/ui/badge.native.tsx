import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type BadgeProps = {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const variantStyles: Record<BadgeVariant, ViewStyle & { textColor: string }> = {
  default: { backgroundColor: "#4F46E5", borderColor: "transparent", textColor: "#FFFFFF" },
  secondary: { backgroundColor: "#E5E7EB", borderColor: "transparent", textColor: "#111827" },
  destructive: { backgroundColor: "#EF4444", borderColor: "transparent", textColor: "#FFFFFF" },
  outline: { backgroundColor: "transparent", borderColor: "#D1D5DB", textColor: "#111827" },
};

export function Badge({ variant = "default", children, style, textStyle }: BadgeProps) {
  const v = variantStyles[variant];
  return (
    <View style={[styles.container, { backgroundColor: v.backgroundColor, borderColor: v.borderColor }, style]}>
      <Text style={[styles.text, { color: v.textColor }, textStyle]}>{children}</Text>
    </View>
  );
}

export const badgeVariants = variantStyles;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

