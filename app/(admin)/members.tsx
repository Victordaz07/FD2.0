import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { getFamilyMembers, getMember } from "@/lib/db/members";
import { useFamilyStore } from "@/store/familyStore";
import { useAuthStore } from "@/store/authStore";
import { useAttentionStore } from "@/store/attentionStore";
import { FamilyMember, Role } from "@/lib/types";
import { isParentalRole } from "@/lib/policy/agePolicy";
import { useToast } from "@/hooks/useToast";
import { toBool } from "@/lib/helpers/booleanHelpers";

export default function MembersScreen() {
  const { currentFamily } = useFamilyStore();
  const { user } = useAuthStore();
  const { sendRequest, loading: sendingRequest } = useAttentionStore();
  const { showError, showSuccess } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Attention Ring modal state
  const [showRingModal, setShowRingModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  );
  const [intensity, setIntensity] = useState<"normal" | "loud">("normal");
  const [durationSec, setDurationSec] = useState<15 | 30 | 60>(30);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentFamily) {
      loadMembers();
    }
  }, [currentFamily]);

  const loadMembers = async () => {
    if (!currentFamily) return;

    setLoading(true);
    try {
      const familyMembers = await getFamilyMembers(currentFamily.id);
      setMembers(familyMembers);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRingModal = async (member: FamilyMember) => {
    if (!currentFamily) return;

    // Load member's attentionMode to check allowLoud
    try {
      const fullMember = await getMember(currentFamily.id, member.uid);
      if (fullMember) {
        setSelectedMember(fullMember);
        // Force boolean conversion - defensive programming
        const allowLoud = toBool(fullMember.attentionMode?.allowLoud);
        // If allowLoud is false, default to normal
        if (!allowLoud) {
          setIntensity("normal");
        }
        setShowRingModal(true);
      }
    } catch (error) {
      showError("Error al cargar información del miembro");
    }
  };

  const handleSendRing = async () => {
    if (!currentFamily || !selectedMember) return;

    try {
      await sendRequest(
        currentFamily.id,
        selectedMember.uid,
        intensity,
        durationSec,
        message.trim() || undefined
      );
      showSuccess("Solicitud de atención enviada");
      setShowRingModal(false);
      setMessage("");
      setIntensity("normal");
      setDurationSec(30);
    } catch (error: any) {
      showError(error.message || "Error al enviar solicitud");
    }
  };

  const renderMember = ({ item }: { item: FamilyMember }) => {
    const isCurrentUser = item.uid === user?.uid;
    const currentMember = members.find((m) => m.uid === user?.uid);
    const isParent = currentMember && isParentalRole(currentMember.role);
    const canSendRing = isParent && !isCurrentUser;

    return (
      <View style={styles.memberCard}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.displayName ||
              (item.uid === user?.uid
                ? "Tú"
                : `Usuario ${item.uid.substring(0, 8)}`)}
          </Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          {item.ageGroup && (
            <Text style={styles.memberAgeGroup}>Grupo: {item.ageGroup}</Text>
          )}
        </View>
        <View style={styles.memberActions}>
          {isCurrentUser && <Text style={styles.currentUserBadge}>Tú</Text>}
          {canSendRing && (
            <TouchableOpacity
              style={styles.ringButton}
              onPress={() => handleOpenRingModal(item)}
            >
              <Text style={styles.ringButtonText}>🔔</Text>
            </TouchableOpacity>
          )}
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
      <Text style={styles.title}>Miembros de la Familia</Text>
      {currentFamily && (
        <Text style={styles.familyName}>{currentFamily.name}</Text>
      )}
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.uid}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Attention Ring Modal */}
      {/* #region agent log */}
      {(() => {
        fetch(
          "http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "members.tsx:159",
              message: "Modal visible - prop value check",
              data: {
                showRingModalType: typeof showRingModal,
                showRingModalValue: showRingModal,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "C",
            }),
          }
        ).catch(() => {});
        return null;
      })()}
      {/* #endregion */}
      <Modal
        visible={showRingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔔 Attention Ring</Text>
            {selectedMember && (
              <Text style={styles.modalSubtitle}>
                Enviar a:{" "}
                {selectedMember.displayName ||
                  `Usuario ${selectedMember.uid.substring(0, 8)}`}
              </Text>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Intensidad</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    intensity === "normal" && styles.radioOptionSelected,
                  ]}
                  onPress={() => setIntensity("normal")}
                >
                  <Text
                    style={[
                      styles.radioText,
                      intensity === "normal" && styles.radioTextSelected,
                    ]}
                  >
                    Normal
                  </Text>
                </TouchableOpacity>
                {(() => {
                  // Force boolean conversion - defensive programming
                  const enabled = toBool(
                    selectedMember?.attentionMode?.enabled
                  );
                  const allowLoud = toBool(
                    selectedMember?.attentionMode?.allowLoud
                  );
                  const canUseLoud = enabled && allowLoud;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.radioOption,
                        intensity === "loud" && styles.radioOptionSelected,
                        !canUseLoud && styles.radioOptionDisabled,
                      ]}
                      onPress={() => {
                        if (canUseLoud) {
                          setIntensity("loud");
                        }
                      }}
                      disabled={!canUseLoud}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          intensity === "loud" && styles.radioTextSelected,
                          !canUseLoud && styles.radioTextDisabled,
                        ]}
                      >
                        Fuerte {!canUseLoud && "(no permitido)"}
                      </Text>
                    </TouchableOpacity>
                  );
                })()}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Duración</Text>
              <View style={styles.radioGroup}>
                {[15, 30, 60].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.radioOption,
                      durationSec === duration && styles.radioOptionSelected,
                    ]}
                    onPress={() => setDurationSec(duration as 15 | 30 | 60)}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        durationSec === duration && styles.radioTextSelected,
                      ]}
                    >
                      {duration}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Mensaje (opcional)</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Mensaje opcional..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowRingModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSend]}
                onPress={handleSendRing}
                disabled={sendingRequest}
              >
                {sendingRequest ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonTextSend}>Enviar</Text>
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  familyName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 2,
  },
  memberAgeGroup: {
    fontSize: 12,
    color: "#666",
  },
  currentUserBadge: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
  },
  memberActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ringButton: {
    padding: 8,
  },
  ringButtonText: {
    fontSize: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
  radioOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  radioOptionDisabled: {
    opacity: 0.5,
  },
  radioText: {
    fontSize: 14,
    color: "#333",
  },
  radioTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  radioTextDisabled: {
    color: "#999",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#f5f5f5",
  },
  modalButtonSend: {
    backgroundColor: "#007AFF",
  },
  modalButtonTextCancel: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonTextSend: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
