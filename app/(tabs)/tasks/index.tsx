import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { useTaskStore } from '@/store/taskStore';
import { listActiveTasks } from '@/lib/db/tasks';
import { createCompletion } from '@/lib/db/taskCompletions';
import { Task } from '@/lib/types';
import { isParentalRole } from '@/lib/policy/agePolicy';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function TasksScreen() {
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const { tasks, setTasks, loading, setLoading, error, setError } = useTaskStore();
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    if (currentFamily) {
      loadTasks();
    }
  }, [currentFamily]);

  const loadTasks = async () => {
    if (!currentFamily) return;

    setLoading(true);
    setError(null);
    try {
      const activeTasks = await listActiveTasks(currentFamily.id);
      setTasks(activeTasks);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar tareas';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!currentFamily || !user) {
      Alert.alert('Error', 'Debes estar autenticado');
      return;
    }

    setCompletingTaskId(task.id);
    try {
      await createCompletion(currentFamily.id, {
        taskId: task.id,
        memberUid: user.uid,
        createdBy: user.uid,
      });
      const successMessage = 'Tarea completada. ' + (task.requiresApproval ? 'Esperando aprobación.' : 'Aprobada automáticamente.');
      showSuccess(successMessage);
      loadTasks();
    } catch (err: any) {
      showError(err.message || 'Error al completar la tarea');
    } finally {
      setCompletingTaskId(null);
    }
  };

  const renderTask = ({ item }: { item: Task }) => {
    const isCompleting = completingTaskId === item.id;
    const currentMember = members.find((m) => m.uid === user?.uid);
    // All members (including children) can complete tasks
    const canComplete = !!currentMember;

    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => router.push(`/(tabs)/tasks/${item.id}`)}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description && <Text style={styles.taskDescription}>{item.description}</Text>}
          <View style={styles.taskMeta}>
            {item.points && <Text style={styles.taskPoints}>{item.points} puntos</Text>}
            {item.amountCents && (
              <Text style={styles.taskAmount}>${(item.amountCents / 100).toFixed(2)}</Text>
            )}
            {item.requiresApproval && (
              <Text style={styles.taskApproval}>Requiere aprobación</Text>
            )}
          </View>
        </View>
        {canComplete && (
          <TouchableOpacity
            style={[styles.completeButton, isCompleting && styles.completeButtonDisabled]}
            onPress={(e) => {
              e.stopPropagation();
              handleCompleteTask(item);
            }}
            disabled={isCompleting}
          >
            {isCompleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.completeButtonText}>Completar</Text>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentMember = members.find((m) => m.uid === user?.uid);
  const isParent = currentMember && isParentalRole(currentMember.role);

  return (
    <View style={styles.container}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
        {isParent && (
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.push('/(tabs)/tasks/new')}
          >
            <Text style={styles.newButtonText}>Nueva Tarea</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas activas</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadTasks}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  taskPoints: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  taskAmount: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  taskApproval: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

