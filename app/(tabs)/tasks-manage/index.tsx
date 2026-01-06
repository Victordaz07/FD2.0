import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useFamilyStore } from '@/store/familyStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { listMembers, ManagedMember } from '@/lib/db/membersCrud';
import {
  listTasks,
  createTask,
  updateTask,
  setTaskStatus,
  ManagedTask,
  TaskStatus,
} from '@/lib/db/tasksCrud';

export default function TasksManageScreen() {
  const { currentFamily } = useFamilyStore();
  const { user } = useAuthStore();
  const { showError, showSuccess } = useToast();

  const [tasks, setTasks] = useState<ManagedTask[]>([]);
  const [members, setMembers] = useState<ManagedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ManagedTask | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAssignedToMemberId, setFormAssignedToMemberId] = useState('');

  useEffect(() => {
    const familyId = currentFamily?.id;
    if (familyId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentFamily]);

  const loadData = async () => {
    const familyId = currentFamily?.id;
    if (!familyId) return;

    setLoading(true);
    try {
      const [tasksList, membersList] = await Promise.all([
        listTasks(familyId),
        listMembers(familyId),
      ]);
      setTasks(tasksList);
      setMembers(membersList);
    } catch (error: any) {
      showError(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: ManagedTask) => {
    if (task) {
      setEditingTask(task);
      setFormTitle(task.title);
      setFormDescription(task.description || '');
      setFormAssignedToMemberId(task.assignedToMemberId);
    } else {
      setEditingTask(null);
      setFormTitle('');
      setFormDescription('');
      setFormAssignedToMemberId(members[0]?.id || '');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormAssignedToMemberId('');
  };

  const handleSave = async () => {
    const familyId = currentFamily?.id;
    if (!familyId || !user) return;

    const title = formTitle.trim();
    if (!title) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }

    if (!formAssignedToMemberId.trim()) {
      Alert.alert('Error', 'Debe asignar la tarea a un miembro');
      return;
    }

    // Find member for displayName
    const assignedMember = members.find(
      (m) => m.id === formAssignedToMemberId
    );

    setSaving(true);
    try {
      if (editingTask) {
        // Update existing
        await updateTask(familyId, editingTask.id, {
          title: title,
          description: formDescription.trim() || undefined,
          assignedToMemberId: formAssignedToMemberId,
          assignedToDisplayName: assignedMember?.displayName,
        });
        showSuccess('Tarea actualizada');
      } else {
        // Create new
        await createTask(familyId, {
          title: title,
          description: formDescription.trim() || undefined,
          assignedToMemberId: formAssignedToMemberId,
          assignedToDisplayName: assignedMember?.displayName,
          createdBy: user.uid,
        });
        showSuccess('Tarea creada');
      }
      handleCloseModal();
      await loadData();
    } catch (error: any) {
      showError(error.message || 'Error al guardar tarea');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (task: ManagedTask) => {
    const familyId = currentFamily?.id;
    if (!familyId) return;

    const newStatus: TaskStatus = task.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';

    try {
      await setTaskStatus(familyId, task.id, newStatus);
      showSuccess(
        newStatus === 'COMPLETED' ? 'Tarea completada' : 'Tarea reabierta'
      );
      await loadData();
    } catch (error: any) {
      showError(error.message || 'Error al cambiar estado');
    }
  };

  const getAssignedMemberName = (task: ManagedTask): string => {
    if (task.assignedToDisplayName) {
      return task.assignedToDisplayName;
    }
    const member = members.find((m) => m.id === task.assignedToMemberId);
    return member?.displayName || 'Miembro desconocido';
  };

  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  const renderTask = ({ item }: { item: ManagedTask }) => {
    return (
      <View style={styles.taskCard}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
          <Text style={styles.taskAssigned}>
            Asignado a: {getAssignedMemberName(item)}
          </Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleOpenModal(item)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              item.status === 'ACTIVE'
                ? styles.statusButtonComplete
                : styles.statusButtonReopen,
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={styles.statusButtonText}>
              {item.status === 'ACTIVE' ? 'Completar' : 'Reabrir'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // No family selected
  const familyId = currentFamily?.id;
  if (!familyId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay familia seleccionada</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs internos */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ACTIVE' && styles.tabActive]}
          onPress={() => setActiveTab('ACTIVE')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'ACTIVE' && styles.tabTextActive,
            ]}
          >
            Activas ({tasks.filter((t) => t.status === 'ACTIVE').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'COMPLETED' && styles.tabActive]}
          onPress={() => setActiveTab('COMPLETED')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'COMPLETED' && styles.tabTextActive,
            ]}
          >
            Completadas ({tasks.filter((t) => t.status === 'COMPLETED').length})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'ACTIVE'
              ? 'No hay tareas activas'
              : 'No hay tareas completadas'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </Text>

              <Text style={styles.modalLabel}>Título *</Text>
              <TextInput
                style={styles.modalInput}
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="Título de la tarea"
                editable={!saving}
              />

              <Text style={styles.modalLabel}>Descripción</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={formDescription}
                onChangeText={setFormDescription}
                placeholder="Descripción opcional"
                multiline
                numberOfLines={4}
                editable={!saving}
              />

              <Text style={styles.modalLabel}>Asignar a *</Text>
              {members.length === 0 ? (
                <Text style={styles.modalError}>
                  No hay miembros disponibles. Crea miembros primero.
                </Text>
              ) : (
                <View style={styles.memberSelector}>
                  {members.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberOption,
                        formAssignedToMemberId === member.id &&
                          styles.memberOptionSelected,
                      ]}
                      onPress={() => setFormAssignedToMemberId(member.id)}
                      disabled={saving}
                    >
                      <Text
                        style={[
                          styles.memberOptionText,
                          formAssignedToMemberId === member.id &&
                            styles.memberOptionTextSelected,
                        ]}
                      >
                        {member.displayName || 'Sin nombre'} ({member.role})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleCloseModal}
                  disabled={saving}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={handleSave}
                  disabled={saving || members.length === 0}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonTextSave}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskInfo: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskAssigned: {
    fontSize: 14,
    color: '#007AFF',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonComplete: {
    backgroundColor: '#4CAF50',
  },
  statusButtonReopen: {
    backgroundColor: '#FF9800',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  memberSelector: {
    gap: 8,
  },
  memberOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  memberOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  memberOptionText: {
    fontSize: 14,
    color: '#333',
  },
  memberOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalError: {
    fontSize: 14,
    color: '#F44336',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f5f5f5',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonTextCancel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

