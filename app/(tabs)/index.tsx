import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getFamily } from '@/lib/db/families';
import { getFamilyMembers } from '@/lib/db/members';
import { theme } from '@/theme/theme';
import {
  FDScreen,
  FDText,
  FDSection,
  FDStatPill,
  FDListItem,
  FDCard,
  FDButton,
  FDBadge,
} from '@/components/ui';

// Utilidades header (simple, estable)
function formatDateLong(d: Date) {
  try {
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return d.toDateString();
  }
}

function getGreeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentFamily, setCurrentFamily, setMembers, members } = useFamilyStore();

  // ----------------------------
  // Mantener lógica existente
  // ----------------------------
  useEffect(() => {
    if (user?.activeFamilyId) {
      void loadFamilyData();
    }
  }, [user?.activeFamilyId]);

  const loadFamilyData = async () => {
    if (!user?.activeFamilyId) return;
    try {
      const family = await getFamily(user.activeFamilyId);
      if (family) {
        setCurrentFamily(family);
      }
      const membersData = await getFamilyMembers(user.activeFamilyId);
      setMembers(membersData);
    } catch (error: any) {
      // Log error but don't break the UI
      console.error('Error loading family data:', error);
      // If it's a permissions error, it might mean the user isn't a member yet
      // The UI will still render with fallback data
      if (error?.code === 'permission-denied') {
        console.warn('Permission denied: User may not be a member of this family yet');
      }
    }
  };

  // ----------------------------
  // Header dinámico
  // ----------------------------
  const now = useMemo(() => new Date(), []);
  const greeting = useMemo(() => getGreeting(now), [now]);
  const dateLabel = useMemo(() => formatDateLong(now), [now]);

  // ----------------------------
  // Stats: usar datos reales si existen; fallback a hardcode
  // ----------------------------
  const streakDays = currentFamily?.id ? 15 : 5; // TODO: conectar a Firestore cuando exista
  const pendingTasks = 8; // TODO: calcular desde tasks reales
  const upcomingEvents = 3; // TODO: calcular desde eventos próximos
  const points = 4250; // TODO: conectar a Firestore cuando exista
  const pointsLabel = new Intl.NumberFormat('es-US').format(points);

  // ----------------------------
  // Datos reales para actividad reciente
  // ----------------------------
  const firstMember = members?.[0];
  const memberName = firstMember?.displayName ?? 'Un miembro';

  // ----------------------------
  // Navegaciones existentes (mantener) con try-catch defensivo
  // ----------------------------
  const goFamilyHub = () => {
    try {
      router.push('/(tabs)/familyhub');
    } catch (e) {
      console.error('Navigation error to familyhub:', e);
    }
  };
  const goPlan = () => {
    try {
      router.push('/(tabs)/plan');
    } catch (e) {
      console.error('Navigation error to plan:', e);
    }
  };
  const goLegacy = () => {
    try {
      router.push('/legacy-home');
    } catch (e) {
      console.error('Navigation error to legacy-home:', e);
    }
  };

  return (
    <FDScreen scroll>
      {/* Header */}
      <FDText variant="h1">
        {greeting}, {user?.displayName ?? 'Familia'}
      </FDText>
      <FDText tone="secondary" style={{ textTransform: 'capitalize' }}>
        {dateLabel}
      </FDText>

      <View style={{ height: theme.spacing.xl }} />

      {/* Manejo de "sin familia" */}
      {!user?.activeFamilyId ? (
        <>
          <FDCard
            style={{
              backgroundColor: theme.colors.warningLight,
              borderColor: theme.colors.warningLight,
            }}
          >
            <FDText variant="h2">⚠️ Falta tu familia</FDText>
            <FDText tone="secondary">
              Crea o selecciona una familia para ver tu dashboard.
            </FDText>
            <View style={{ height: theme.spacing.lg }} />
            <FDButton label="Ir a FamilyHub" onPress={goFamilyHub} />
          </FDCard>
          <View style={{ height: theme.spacing['2xl'] }} />
        </>
      ) : null}

      {/* Stats (2x2) */}
      <FDSection title="Resumen de hoy" subtitle="Rápido, claro y sin ruido.">
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <FDStatPill
              label="Racha familiar"
              value={`${streakDays} días`}
              tone="success"
              variant="solid"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FDStatPill
              label="Pendientes"
              value={pendingTasks}
              tone="warning"
              variant="solid"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}>
            <FDStatPill
              label="Próximos"
              value={upcomingEvents}
              tone="accent"
              variant="solid"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FDStatPill
              label="Puntos"
              value={pointsLabel}
              tone="secondary"
              variant="solid"
            />
          </View>
        </View>
      </FDSection>

      <View style={{ height: theme.spacing['2xl'] }} />

      {/* Actividad reciente (3 items) */}
      <FDSection title="Actividad reciente" actionLabel="Ver Plan" onActionPress={goPlan}>
        <FDListItem
          title={`${memberName} completó una tarea`}
          subtitle="Reciente"
          right={<FDBadge label="Hecho" tone="success" />}
          onPress={goPlan}
        />
        <FDListItem
          title={`${memberName}: Tarea pendiente`}
          subtitle="Pendiente • vence hoy"
          right={<FDBadge label="Hoy" tone="warning" />}
          onPress={goPlan}
        />
        <FDListItem
          title="Meta familiar: Lectura"
          subtitle="Racha activa"
          right={<FDBadge label="Racha" tone="primary" />}
          onPress={goFamilyHub}
        />
      </FDSection>

      <View style={{ height: theme.spacing['2xl'] }} />

      {/* Banner motivacional */}
      <FDCard
        style={{
          backgroundColor: theme.colors.primaryBg,
          borderColor: theme.colors.primaryBg,
        }}
      >
        <FDText variant="h2">🎉 Mantengan la racha</FDText>
        <FDText tone="secondary">
          Completen 1 tarea más hoy y cierran el día con victoria familiar.
        </FDText>

        <View style={{ height: theme.spacing.lg }} />
        <FDButton label="Ir al Plan" onPress={goPlan} />
        <View style={{ height: theme.spacing.sm }} />
        <FDButton label="Abrir FamilyHub" variant="secondary" onPress={goFamilyHub} />
        <View style={{ height: theme.spacing.sm }} />
        {/* Botón opcional para comparar */}
        <FDButton label="Ver Home viejo" variant="secondary" onPress={goLegacy} />
      </FDCard>

      <View style={{ height: theme.spacing['3xl'] }} />
    </FDScreen>
  );
}
