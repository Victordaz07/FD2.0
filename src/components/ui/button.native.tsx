import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean; // kept for API parity, ignored in native
  children?: React.ReactNode;
};

const baseButton: ViewStyle = {
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: "#4F46E5" },
  destructive: { backgroundColor: "#EF4444" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D4D4D8",
  },
  secondary: { backgroundColor: "#E5E7EB" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: { paddingHorizontal: 16, paddingVertical: 10, minHeight: 40 },
  sm: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 },
  lg: { paddingHorizontal: 18, paddingVertical: 12, minHeight: 44 },
  icon: { padding: 10, minHeight: 40, minWidth: 40 },
};

const textBase: TextStyle = {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "600",
};

function getTextColor(variant: ButtonVariant): TextStyle {
  if (
    variant === "outline" ||
    variant === "ghost" ||
    variant === "link" ||
    variant === "secondary"
  ) {
    return { color: "#111827" };
  }
  return {};
}

export function Button({
  variant = "default",
  size = "default",
  style,
  children,
  ...rest
}: ButtonProps) {
  const resolved = StyleSheet.flatten([
    baseButton,
    variantStyles[variant],
    sizeStyles[size],
    style,
  ]);

  const textStyle = StyleSheet.flatten([textBase, getTextColor(variant)]);

  return (
    <Pressable style={resolved} {...rest}>
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export const buttonVariants = {
  base: baseButton,
  variantStyles,
  sizeStyles,
};
