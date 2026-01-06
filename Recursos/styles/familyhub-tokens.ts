/**
 * FamilyHub Design Tokens
 * Sistema de diseño móvil moderno (max-width: 390px)
 * Tipografía: Inter, bordes redondeados, cards blancas
 */

export const familyHubTokens = {
  // Colores base
  colors: {
    // Backgrounds
    background: '#F6F7FB',
    cardBackground: '#FFFFFF',
    
    // Primarios
    primary: {
      main: '#4F46E5',      // Indigo principal
      light: '#6366F1',
      dark: '#4338CA',
      50: '#EEF2FF',
      100: '#E0E7FF',
    },
    
    // Categorías (calendar)
    task: {
      main: '#3B82F6',      // Azul - Tareas
      light: '#60A5FA',
      bg: '#EFF6FF',
    },
    
    goal: {
      main: '#A855F7',      // Morado - Metas
      light: '#C084FC',
      bg: '#FAF5FF',
    },
    
    event: {
      main: '#6366F1',      // Índigo - Eventos
      light: '#818CF8',
      bg: '#EEF2FF',
    },
    
    // Finances
    income: {
      main: '#10B981',      // Verde - Ingresos/Ahorros
      light: '#34D399',
      bg: '#D1FAE5',
    },
    
    expense: {
      main: '#EF4444',      // Rojo - Gastos
      light: '#F87171',
      bg: '#FEE2E2',
    },
    
    allowance: {
      main: '#F59E0B',      // Amber - Mesadas
      light: '#FCD34D',
      bg: '#FEF3C7',
    },
    
    // Neutrales
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
    },
    
    // Estados
    success: {
      main: '#10B981',
      bg: '#D1FAE5',
    },
    
    error: {
      main: '#EF4444',
      bg: '#FEE2E2',
    },
    
    warning: {
      main: '#F59E0B',
      bg: '#FEF3C7',
    },
    
    info: {
      main: '#3B82F6',
      bg: '#DBEAFE',
    },
  },
  
  // Tipografía
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
    },
    
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeights: {
      tight: '1.25',
      base: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Espaciado
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  
  // Border radius (16-24 según spec)
  borderRadius: {
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    full: '9999px',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Dimensiones
  dimensions: {
    maxWidth: '390px',
    headerHeight: '60px',
    bottomNavHeight: '64px',
    buttonHeight: '48px',
    inputHeight: '48px',
  },
  
  // Animaciones
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default familyHubTokens;
