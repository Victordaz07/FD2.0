import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { createFamily } from '@/lib/db/families';
import { addMember } from '@/lib/db/members';
import { updateUserActiveFamily } from '@/lib/db/users';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getCurrentAuthUser } from '@/lib/auth/authService';
import { getFamily } from '@/lib/db/families';

export default function CreateFamilyScreen() {
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);
  const setUser = useAuthStore((state) => state.setUser);

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para tu familia');
      return;
    }

    const authUser = getCurrentAuthUser();
    if (!authUser || !user) {
      Alert.alert('Error', 'Debes estar autenticado');
      return;
    }

    setLoading(true);
    try {
      // Create family
      const familyId = await createFamily({
        name: familyName.trim(),
        createdBy: user.uid,
      });

      // Add creator as PARENT member
      await addMember({
        familyId,
        uid: user.uid,
        role: 'PARENT',
        createdBy: user.uid,
      });

      // Update user's active family
      await updateUserActiveFamily(user.uid, familyId);

      // Update stores
      const family = await getFamily(familyId);
      if (family) {
        setCurrentFamily(family);
      }
      setUser({ ...user, activeFamilyId: familyId });

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la familia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Familia</Text>
      <Text style={styles.subtitle}>
        Crea una nueva familia para comenzar a usar FamilyDash
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la familia"
        value={familyName}
        onChangeText={setFamilyName}
        editable={!loading}
        autoCapitalize="words"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateFamily}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear Familia</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(onboarding)/join-family')}
        disabled={loading}
      >
        <Text style={styles.link}>¿Tienes un código? Únete a una familia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    color: '#007AFF',
    fontSize: 14,
  },
});
