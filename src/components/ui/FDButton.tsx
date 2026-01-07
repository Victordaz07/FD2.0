import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { theme } from "@/theme/theme";
import { FDText } from "./FDText";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

export type FDButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
};

export function FDButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  testID,
}: FDButtonProps) {
  const isDisabled = disabled || loading;

  const cfg = useMemo(() => {
    if (variant === "secondary") {
      return {
        bg: theme.colors.muted,
        fg: theme.colors.textPrimary,
        bgPressed: theme.colors.border,
      };
    }
    return {
      bg: theme.colors.primary,
      fg: theme.colors.primaryFg,
      bgPressed: theme.colors.primaryDark,
    };
  }, [variant]);

  const height = size === "md" ? theme.touch.min : theme.touch.recommended; // 44 / 48

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          backgroundColor: isDisabled
            ? theme.colors.border
            : pressed
              ? cfg.bgPressed
              : cfg.bg,
          opacity: isDisabled ? 0.85 : 1,
          transform: pressed && !isDisabled ? [{ scale: 0.98 }] : undefined,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FDText
            variant="body"
            tone={variant === "primary" ? "onColor" : "primary"}
            style={[styles.label, { color: cfg.fg }, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </FDText>
        )}

        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md, // 12
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm, // 8
    paddingVertical: 12,
  },
  label: {
    fontWeight: theme.typography.weight.semibold,
  },
  iconLeft: { marginRight: theme.spacing.xs },
  iconRight: { marginLeft: theme.spacing.xs },
});

