/**
 * Design System Tokens
 * Mobile-First Design System for Family Productivity App
 * Compatible with React Native/Expo for future migration
 */

export const colors = {
  // Primary Palette - Indigo
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral Palette - Slate (Warm Gray)
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50: '#FEF3C7',
    100: '#FDE68A',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Accent Colors for Categories/Features
  emerald: {
    50: '#ECFDF5',
    500: '#10B981',
    600: '#059669',
  },

  amber: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },

  rose: {
    50: '#FFF1F2',
    500: '#F43F5E',
    600: '#E11D48',
  },

  purple: {
    50: '#FAF5FF',
    500: '#A855F7',
    600: '#9333EA',
  },

  sky: {
    50: '#F0F9FF',
    500: '#0EA5E9',
    600: '#0284C7',
  },

  teal: {
    50: '#F0FDFA',
    500: '#14B8A6',
    600: '#0D9488',
  },
};

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  fontSize: {
    xs: '12px',      // 0.75rem - Small labels, captions
    sm: '14px',      // 0.875rem - Body small, secondary text
    base: '16px',    // 1rem - Body text, primary content
    lg: '18px',      // 1.125rem - Large body, emphasis
    xl: '20px',      // 1.25rem - Section headers
    '2xl': '24px',   // 1.5rem - Page titles
    '3xl': '30px',   // 1.875rem - Hero titles
    '4xl': '36px',   // 2.25rem - Display text
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

export const borderRadius = {
  none: '0px',
  sm: '6px',       // Small elements (badges, tags)
  md: '8px',       // Standard elements (buttons, inputs)
  lg: '12px',      // Cards, containers
  xl: '16px',      // Large cards, modals
  '2xl': '20px',   // Hero sections, special cards
  '3xl': '24px',   // Extra large containers
  full: '9999px',  // Pills, avatars
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
};

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    paddingX: {
      sm: spacing[3],
      md: spacing[4],
      lg: spacing[5],
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
  },

  input: {
    height: {
      sm: '36px',
      md: '44px',
      lg: '52px',
    },
    paddingX: spacing[4],
    fontSize: typography.fontSize.base,
  },

  card: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    shadow: shadows.sm,
  },

  badge: {
    paddingX: spacing[2],
    paddingY: spacing[1],
    fontSize: typography.fontSize.xs,
    borderRadius: borderRadius.sm,
  },

  modal: {
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    maxWidth: '480px',
  },

  bottomNav: {
    height: '64px',
    iconSize: '24px',
    fontSize: typography.fontSize.xs,
  },
};

// Animation/Transition tokens
export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Export all tokens as a single object for easy import
export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  opacity,
  zIndex,
  components,
  animation,
};

export default tokens;
