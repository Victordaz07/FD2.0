import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { createTask } from '@/lib/db/tasks';
import { Timestamp } from 'firebase/firestore';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function NewTaskScreen() {
  const { user } = useAuthStore();
  const { currentFamily } = useFamilyStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [amountCents, setAmountCents] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleCreateTask = async () => {
    if (!title.trim()) {
      showError('El título es requerido');
      return;
    }

    if (!points && !amountCents) {
      showError('Debe proporcionar puntos o mesada');
      return;
    }

    if (!currentFamily || !user) {
      showError('Debes estar autenticado');
      return;
    }

    setLoading(true);
    try {
      await createTask(currentFamily.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        points: points ? parseInt(points, 10) : undefined,
        amountCents: amountCents ? Math.round(parseFloat(amountCents) * 100) : undefined,
        requiresApproval,
        createdBy: user.uid,
      });
      showSuccess('Tarea creada correctamente');
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      showError(error.message || 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Tarea</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Sacar la basura"
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción opcional"
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Puntos</Text>
        <TextInput
          style={styles.input}
          value={points}
          onChangeText={setPoints}
          placeholder="0"
          keyboardType="number-pad"
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mesada (USD)</Text>
        <TextInput
          style={styles.input}
          value={amountCents}
          onChangeText={setAmountCents}
          placeholder="0.00"
          keyboardType="decimal-pad"
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Requiere aprobación</Text>
          <Switch
            value={requiresApproval}
            onValueChange={setRequiresApproval}
            disabled={loading}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateTask}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear Tarea</Text>
        )}
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
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
});

