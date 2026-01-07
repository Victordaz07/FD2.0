import { colors } from "./colors";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { typography } from "./typography";
import { shadows } from "./shadows";

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,

  touch: {
    min: 44,
    recommended: 48,
  },

  layout: {
    screenPaddingX: 20,
    screenPaddingTop: 16,
    screenPaddingBottom: 24,

    cardPadding: spacing.base, // 16
    cardGap: spacing.md,       // 12
    sectionGap: spacing.xl,    // 24
  },
} as const;

export type Theme = typeof theme;

