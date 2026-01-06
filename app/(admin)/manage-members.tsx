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
} from 'react-native';
import { router } from 'expo-router';
import { useFamilyStore } from '@/store/familyStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import {
  listMembers,
  createMember,
  updateMember,
  toggleMemberActive,
  ManagedMember,
  ManagedRole,
} from '@/lib/db/membersCrud';

export default function ManageMembersScreen() {
  const { currentFamily } = useFamilyStore();
  const { user } = useAuthStore();
  const { showError, showSuccess } = useToast();

  const [members, setMembers] = useState<ManagedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagedMember | null>(
    null
  );
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<ManagedRole>('CHILD');

  useEffect(() => {
    const familyId = currentFamily?.id;
    if (familyId) {
      loadMembers();
    } else {
      setLoading(false);
    }
  }, [currentFamily]);

  const loadMembers = async () => {
    const familyId = currentFamily?.id;
    if (!familyId) return;

    setLoading(true);
    try {
      const membersList = await listMembers(familyId);
      setMembers(membersList);
    } catch (error: any) {
      showError(error.message || 'Error al cargar miembros');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: ManagedMember) => {
    if (member) {
      setEditingMember(member);
      setFormName(member.displayName);
      setFormRole(member.role);
    } else {
      setEditingMember(null);
      setFormName('');
      setFormRole('CHILD');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormName('');
    setFormRole('CHILD');
  };

  const handleSave = async () => {
    const familyId = currentFamily?.id;
    if (!familyId || !user) return;

    const name = formName.trim();
    if (!name) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      if (editingMember) {
        // Update existing
        await updateMember(familyId, editingMember.id, {
          displayName: name,
          role: formRole,
        });
        showSuccess('Miembro actualizado');
      } else {
        // Create new
        await createMember(familyId, {
          displayName: name,
          role: formRole,
          createdBy: user.uid,
        });
        showSuccess('Miembro creado');
      }
      handleCloseModal();
      await loadMembers();
    } catch (error: any) {
      showError(error.message || 'Error al guardar miembro');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (member: ManagedMember) => {
    const familyId = currentFamily?.id;
    if (!familyId) return;

    try {
      await toggleMemberActive(familyId, member.id, member.isActive);
      showSuccess(
        member.isActive ? 'Miembro desactivado' : 'Miembro activado'
      );
      await loadMembers();
    } catch (error: any) {
      showError(error.message || 'Error al cambiar estado');
    }
  };

  const getRoleLabel = (role: ManagedRole): string => {
    const labels: Record<ManagedRole, string> = {
      PARENT: 'Padre/Madre',
      TEEN: 'Adolescente',
      CHILD: 'Niño',
    };
    return labels[role] || role;
  };

  const renderMember = ({ item }: { item: ManagedMember }) => {
    const isEditable = ['PARENT', 'TEEN', 'CHILD'].includes(item.role);

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.displayName || 'Sin nombre'}
          </Text>
          <View style={styles.memberMeta}>
            <Text style={styles.memberRole}>{getRoleLabel(item.role)}</Text>
            {item.rawRole && item.rawRole !== item.role && (
              <Text style={styles.memberRawRole}>({item.rawRole})</Text>
            )}
            <Text
              style={[
                styles.memberStatus,
                item.isActive ? styles.statusActive : styles.statusInactive,
              ]}
            >
              {item.isActive ? 'Activo' : 'Inactivo'}
            </Text>
            {item.uid && (
              <Text style={styles.memberUid}>Con cuenta</Text>
            )}
          </View>
        </View>
        <View style={styles.memberActions}>
          {isEditable && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleOpenModal(item)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              item.isActive
                ? styles.toggleButtonInactive
                : styles.toggleButtonActive,
            ]}
            onPress={() => handleToggleActive(item)}
          >
            <Text style={styles.toggleButtonText}>
              {item.isActive ? 'Desactivar' : 'Activar'}
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
        <Text style={styles.title}>Gestionar Miembros</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {members.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay miembros</Text>
          <Text style={styles.emptySubtext}>
            Presiona "Agregar" para crear el primer miembro
          </Text>
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMember}
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMember ? 'Editar Miembro' : 'Agregar Miembro'}
            </Text>

            <Text style={styles.modalLabel}>Nombre</Text>
            <TextInput
              style={styles.modalInput}
              value={formName}
              onChangeText={setFormName}
              placeholder="Nombre del miembro"
              editable={!saving}
            />

            <Text style={styles.modalLabel}>Rol</Text>
            <View style={styles.roleSelector}>
              {(['PARENT', 'TEEN', 'CHILD'] as ManagedRole[]).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    formRole === role && styles.roleButtonSelected,
                  ]}
                  onPress={() => setFormRole(role)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formRole === role && styles.roleButtonTextSelected,
                    ]}
                  >
                    {getRoleLabel(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonTextSave}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
  listContent: {
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  memberInfo: {
    marginBottom: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  memberRole: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  memberRawRole: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  memberStatus: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    color: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  memberUid: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  memberActions: {
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
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleButtonInactive: {
    backgroundColor: '#F44336',
  },
  toggleButtonText: {
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
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
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
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#333',
  },
  roleButtonTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
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
