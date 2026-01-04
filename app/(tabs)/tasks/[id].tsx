import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getTask } from '@/lib/db/tasks';
import { listCompletionsByTask } from '@/lib/db/taskCompletions';
import { Task, TaskCompletion } from '@/lib/types';
import { isParentalRole } from '@/lib/policy/agePolicy';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const [task, setTask] = useState<Task | null>(null);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentFamily && id) {
      loadTaskData();
    }
  }, [currentFamily, id]);

  const loadTaskData = async () => {
    if (!currentFamily || !id) return;

    setLoading(true);
    try {
      const taskData = await getTask(currentFamily.id, id);
      setTask(taskData);

      if (taskData) {
        const result = await listCompletionsByTask(currentFamily.id, id);
        setCompletions(result.completions);
      }
    } catch (error: any) {
      console.error('Error loading task:', error);
      showError(error.message || 'Error al cargar la tarea');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tarea no encontrada</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentMember = members.find((m) => m.uid === user?.uid);
  const isParent = currentMember && isParentalRole(currentMember.role);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {isParent && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/(tabs)/tasks/edit?id=${task.id}`)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      {task.description && (
        <Text style={styles.taskDescription}>{task.description}</Text>
      )}

      <View style={styles.taskMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Estado:</Text>
          <Text style={styles.metaValue}>{task.isActive ? 'Activa' : 'Inactiva'}</Text>
        </View>
        {task.points && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Puntos:</Text>
            <Text style={styles.metaValue}>{task.points}</Text>
          </View>
        )}
        {task.amountCents && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Mesada:</Text>
            <Text style={styles.metaValue}>${(task.amountCents / 100).toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Aprobación:</Text>
          <Text style={styles.metaValue}>
            {task.requiresApproval ? 'Requiere aprobación' : 'Automática'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Completaciones</Text>
        {completions.length === 0 ? (
          <Text style={styles.emptyText}>No hay completaciones aún</Text>
        ) : (
          completions.map((completion) => {
            const member = members.find((m) => m.uid === completion.memberUid);
            return (
              <View key={completion.id} style={styles.completionCard}>
                <View style={styles.completionHeader}>
                  <Text style={styles.completionMember}>
                    {member ? `Usuario ${member.uid.substring(0, 8)}` : 'Usuario desconocido'}
                  </Text>
                  <Text
                    style={[
                      styles.completionStatus,
                      completion.status === 'approved' && styles.statusApproved,
                      completion.status === 'rejected' && styles.statusRejected,
                      completion.status === 'pending_approval' && styles.statusPending,
                    ]}
                  >
                    {completion.status === 'approved' && 'Aprobado'}
                    {completion.status === 'rejected' && 'Rechazado'}
                    {completion.status === 'pending_approval' && 'Pendiente'}
                  </Text>
                </View>
                <Text style={styles.completionDate}>
                  Completado: {completion.completedAt.toDate().toLocaleDateString()}
                </Text>
                {completion.rejectionReason && (
                  <Text style={styles.rejectionReason}>
                    Razón: {completion.rejectionReason}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </View>
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  taskMeta: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  completionCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  completionMember: {
    fontSize: 14,
    fontWeight: '600',
  },
  completionStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusApproved: {
    backgroundColor: '#4caf50',
    color: '#fff',
  },
  statusRejected: {
    backgroundColor: '#f44336',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#ff9800',
    color: '#fff',
  },
  completionDate: {
    fontSize: 12,
    color: '#666',
  },
  rejectionReason: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

