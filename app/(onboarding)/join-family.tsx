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
import { getFamilyByInviteCode } from '@/lib/db/families';
import { addMember, getMember } from '@/lib/db/members';
import { updateUserActiveFamily } from '@/lib/db/users';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getCurrentAuthUser } from '@/lib/auth/authService';
import { getFamily } from '@/lib/db/families';

export default function JoinFamilyScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);
  const setUser = useAuthStore((state) => state.setUser);

  const handleJoinFamily = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de invitación');
      return;
    }

    const authUser = getCurrentAuthUser();
    if (!authUser || !user) {
      Alert.alert('Error', 'Debes estar autenticado');
      return;
    }

    setLoading(true);
    try {
      // Find family by invite code
      const family = await getFamilyByInviteCode(inviteCode.trim().toUpperCase());
      if (!family) {
        Alert.alert('Error', 'Código de invitación no válido');
        setLoading(false);
        return;
      }

      // Check if user is already a member
      const existingMember = await getMember(family.id, user.uid);
      if (existingMember) {
        Alert.alert('Error', 'Ya eres miembro de esta familia');
        setLoading(false);
        return;
      }

      // Add user as CHILD member (default role for joining)
      await addMember({
        familyId: family.id,
        uid: user.uid,
        role: 'CHILD',
        createdBy: user.uid,
      });

      // Update user's active family
      await updateUserActiveFamily(user.uid, family.id);

      // Update stores
      const updatedFamily = await getFamily(family.id);
      if (updatedFamily) {
        setCurrentFamily(updatedFamily);
      }
      setUser({ ...user, activeFamilyId: family.id });

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al unirse a la familia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a Familia</Text>
      <Text style={styles.subtitle}>
        Ingresa el código de invitación que te proporcionó un miembro de la familia
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de invitación"
        value={inviteCode}
        onChangeText={(text) => setInviteCode(text.toUpperCase())}
        editable={!loading}
        autoCapitalize="characters"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleJoinFamily}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Unirse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(onboarding)/create-family')}
        disabled={loading}
      >
        <Text style={styles.link}>¿No tienes código? Crea una familia</Text>
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
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '600',
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
