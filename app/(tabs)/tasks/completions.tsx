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
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { listPendingApprovals } from '@/lib/db/taskCompletions';
import { approveTaskCompletion, rejectTaskCompletion } from '@/lib/functions/taskFunctions';
import { TaskCompletion } from '@/lib/types';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function TaskCompletionsScreen() {
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    if (currentFamily) {
      loadPendingApprovals();
    }
  }, [currentFamily]);

  const loadPendingApprovals = async () => {
    if (!currentFamily) return;

    setLoading(true);
    try {
      const result = await listPendingApprovals(currentFamily.id);
      setCompletions(result.completions);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
      showError('Error al cargar completaciones pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (completion: TaskCompletion) => {
    if (!currentFamily) return;

    setProcessingId(completion.id);
    try {
      await approveTaskCompletion(currentFamily.id, completion.id);
      showSuccess('Completación aprobada');
      loadPendingApprovals();
    } catch (error: any) {
      showError(error.message || 'Error al aprobar');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (completion: TaskCompletion) => {
    if (!currentFamily) return;

    Alert.prompt(
      'Rechazar Completación',
      'Razón del rechazo (opcional):',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async (reason) => {
            setProcessingId(completion.id);
            try {
              await rejectTaskCompletion(currentFamily.id, completion.id, reason || undefined);
              showSuccess('Completación rechazada');
              loadPendingApprovals();
            } catch (error: any) {
              showError(error.message || 'Error al rechazar');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderCompletion = ({ item }: { item: TaskCompletion }) => {
    const member = members.find((m) => m.uid === item.memberUid);
    const isProcessing = processingId === item.id;

    return (
      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionMember}>
            {member ? `Usuario ${member.uid.substring(0, 8)}` : 'Usuario desconocido'}
          </Text>
          <Text style={styles.completionDate}>
            {item.completedAt.toDate().toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.completionMeta}>
          {item.pointsAwarded && (
            <Text style={styles.metaText}>{item.pointsAwarded} puntos</Text>
          )}
          {item.amountCentsAwarded && (
            <Text style={styles.metaText}>
              ${(item.amountCentsAwarded / 100).toFixed(2)}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.rejectButton, isProcessing && styles.buttonDisabled]}
            onPress={() => handleReject(item)}
            disabled={isProcessing}
          >
            <Text style={styles.rejectButtonText}>Rechazar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.approveButton, isProcessing && styles.buttonDisabled]}
            onPress={() => handleApprove(item)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.approveButtonText}>Aprobar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <Text style={styles.title}>Completaciones Pendientes</Text>
      {completions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay completaciones pendientes</Text>
        </View>
      ) : (
        <FlatList
          data={completions}
          renderItem={renderCompletion}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadPendingApprovals}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  completionCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completionMember: {
    fontSize: 16,
    fontWeight: '600',
  },
  completionDate: {
    fontSize: 14,
    color: '#666',
  },
  completionMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  approveButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

