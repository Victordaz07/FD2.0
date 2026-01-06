import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getFamily } from '@/lib/db/families';
import { getFamilyMembers } from '@/lib/db/members';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { currentFamily, setCurrentFamily, setMembers } = useFamilyStore();

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>FamilyDash</Text>
      {currentFamily && (
        <View style={styles.familyCard}>
          <Text style={styles.familyName}>{currentFamily.name}</Text>
          <Text style={styles.familyCode}>Código: {currentFamily.inviteCode}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(admin)/manage-members')}
        >
          <Text style={styles.buttonText}>Gestionar Miembros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(admin)/settings')}
        >
          <Text style={styles.buttonText}>Configuración</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/tasks-manage')}
        >
          <Text style={styles.buttonText}>Tareas v1 (beta)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        Bienvenido a FamilyDash 2.0. Más funciones próximamente.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  familyCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  familyName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  familyCode: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});
