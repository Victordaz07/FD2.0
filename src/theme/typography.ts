import { colors } from "./colors";

export const typography = {
  fontFamily: "Inter",

  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 24,
  "2xl": 30,

  weight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
  },

  lineHeight: {
    xs: 18,
    sm: 20,
    base: 24,
    lg: 26,
    xl: 32,
    "2xl": 40,
  },

  color: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    onColor: colors.textOnColor,
  },
} as const;

