export const colors = {
  background: "#F8F9FB",
  foreground: "#1F2937",

  primary: "#5B6CF2",
  primaryFg: "#FFFFFF",
  primaryLight: "#8B9AF7",
  primaryDark: "#4451C4",
  primaryBg: "#EEF0FE",

  secondary: "#9B6FF9",
  secondaryFg: "#FFFFFF",
  secondaryLight: "#C3A1FB",
  secondaryBg: "#F5F0FF",

  accent: "#14B8A6",
  accentLight: "#5EEAD4",
  accentBg: "#CCFBF1",

  success: "#10B981",
  successFg: "#FFFFFF",
  successLight: "#D1FAE5",

  warning: "#F59E0B",
  warningFg: "#FFFFFF",
  warningLight: "#FEF3C7",

  destructive: "#EF4444",
  destructiveFg: "#FFFFFF",
  destructiveLight: "#FEE2E2",

  info: "#3B82F6",
  infoFg: "#FFFFFF",
  infoLight: "#DBEAFE",

  card: "#FFFFFF",
  cardFg: "#1F2937",

  muted: "#F1F3F9",
  mutedFg: "#6B7280",

  border: "#E5E7EB",
  borderSubtle: "#F3F4F6",

  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textOnColor: "#FFFFFF",

  // --- Hub Stat Colors (más vivos, estilo "hub viejo") ---
  hubOrange: "#F59E0B",
  hubOrangeDark: "#D97706",

  hubBlue: "#3B82F6",
  hubBlueDark: "#2563EB",

  hubPurple: "#8B5CF6",
  hubPurpleDark: "#7C3AED",

  hubGreen: "#10B981",
  hubGreenDark: "#059669",

  hubStatText: "#FFFFFF",
  hubStatSubtext: "rgba(255,255,255,0.85)",
} as const;

export type ColorToken = keyof typeof colors;

