import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getFamily } from '@/lib/db/families';
import { getFamilyMembers } from '@/lib/db/members';
import { StatsCard } from '@/components/familyhub/StatsCard';
import { Ionicons } from '@expo/vector-icons';

// Componente de gradiente seguro - usa color sólido hasta que se reconstruya la app
const SafeGradient = ({ colors, children, style }: { colors: string[]; children: React.ReactNode; style?: any }) => {
  // Usar el primer color como fallback hasta que expo-linear-gradient esté vinculado
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

export default function HomeLegacy() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentFamily, setCurrentFamily, setMembers } = useFamilyStore();

  const { greeting, currentDate } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? '¡Buenos días!' : hour < 18 ? '¡Buenas tardes!' : '¡Buenas noches!';
    const currentDate = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return { greeting, currentDate };
  }, []);

  useEffect(() => {
    if (user?.activeFamilyId) {
      loadFamilyData();
    }
  }, [user?.activeFamilyId]);

  const loadFamilyData = async () => {
    if (!user?.activeFamilyId) return;

    try {
      const family = await getFamily(user.activeFamilyId);
      if (family) {
        setCurrentFamily(family);
      }

      const members = await getFamilyMembers(user.activeFamilyId);
      setMembers(members);
    } catch (error) {
      console.error('Error loading family data:', error);
    }
  };

  const recentActivities = [
    {
      id: '1',
      title: 'Emma completó "Hacer la tarea"',
      meta: 'Hace 2 horas • +50 puntos',
      icon: 'checkmark-done' as const,
      iconColor: '#059669',
      bgColor: '#ECFDF3',
    },
    {
      id: '2',
      title: 'Reunión familiar mañana',
      meta: '18:00 • Toda la familia',
      icon: 'calendar' as const,
      iconColor: '#2563EB',
      bgColor: '#EFF6FF',
    },
    {
      id: '3',
      title: '¡Nueva meta de ahorro creada!',
      meta: 'Vacaciones 2026 • $15,000',
      icon: 'trophy' as const,
      iconColor: '#9333EA',
      bgColor: '#F3E8FF',
    },
  ];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SafeGradient colors={['#6366F1', '#9333EA']} style={styles.avatar}>
            <Text style={styles.avatarText}>👨</Text>
          </SafeGradient>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Resumen rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen rápido</Text>
          <View style={styles.grid2}>
            <View style={styles.cardWrapper}>
              <StatsCard
                emoji="🔥"
                title="Racha familiar"
                value="15 días"
                subtitle="¡Sigan así!"
                color="amber"
                onClick={() => router.push('/(tabs)/familyhub')}
              />
            </View>
            <View style={styles.cardWrapper}>
              <StatsCard
                icon="checkbox"
                title="Pendientes"
                value="8"
                subtitle="tareas hoy"
                color="blue"
                onClick={() => router.push('/(tabs)/plan')}
              />
            </View>
            <View style={styles.cardWrapper}>
              <StatsCard
                icon="calendar"
                title="Próximos"
                value="3"
                subtitle="eventos"
                color="purple"
                onClick={() => router.push('/(tabs)/plan')}
              />
            </View>
            <View style={styles.cardWrapper}>
              <StatsCard
                icon="trophy"
                title="Puntos"
                value="4,250"
                subtitle="familia"
                color="emerald"
                onClick={() => router.push('/(tabs)/familyhub')}
              />
            </View>
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <Pressable onPress={() => {}}>
              <Text style={styles.link}>Ver todo</Text>
            </Pressable>
          </View>

          <View style={styles.listSpace}>
            {recentActivities.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={[styles.cardIcon, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.meta}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Banner de motivación */}
        <View style={styles.section}>
          <SafeGradient colors={['#6366F1', '#9333EA']} style={styles.motivationBanner}>
            <Text style={styles.motivationEmoji}>💪</Text>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>¡Excelente trabajo!</Text>
              <Text style={styles.motivationText}>
                Tu familia ha completado el 75% de las tareas esta semana. ¡Sigan así!
              </Text>
            </View>
          </SafeGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  link: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    width: '48%',
  },
  listSpace: {
    gap: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cardMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  motivationBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  motivationEmoji: {
    fontSize: 32,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

