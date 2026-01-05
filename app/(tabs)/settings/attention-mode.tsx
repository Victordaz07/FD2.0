// TEMPORARILY DISABLED - Attention Mode screen disabled to prevent boolean casting errors
// TODO: Re-enable once boolean casting issues are resolved

import { View, Text, StyleSheet } from "react-native";

export default function AttentionModeSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo de Atención</Text>
      <Text style={styles.message}>
        Esta funcionalidad está temporalmente deshabilitada.
      </Text>
      <Text style={styles.submessage}>
        Se habilitará nuevamente en una actualización futura.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 16,
    textAlign: "center",
  },
  updatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  updatingText: {
    marginLeft: 8,
    color: "#666",
  },
});
