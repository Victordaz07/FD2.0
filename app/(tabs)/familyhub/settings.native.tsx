import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ListCard } from "@/components/familyhub/ListCard";
import { ToggleRow } from "@/components/familyhub/ToggleRow";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  const settingsSections = [
    {
      title: "Cuenta",
      items: [
        { icon: "person-circle-outline" as const, label: "Perfil personal" },
        { icon: "shield-checkmark-outline" as const, label: "Privacidad y seguridad" },
      ],
    },
    {
      title: "Preferencias",
      items: [
        { icon: "color-palette-outline" as const, label: "Personalización" },
        { icon: "notifications-outline" as const, label: "Notificaciones" },
      ],
    },
    {
      title: "Ayuda",
      items: [{ icon: "help-circle-outline" as const, label: "Centro de ayuda" }],
    },
  ];

  return (
    <View style={styles.screen}>
      <AppHeader title="Configuración" subtitle="Ajustes de la aplicación" showAddButton={false} />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontSize: 28 }}>👨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Papá (Robert)</Text>
              <Text style={styles.profileEmail}>robert@email.com</Text>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={12} color="#4338CA" />
                <Text style={styles.badgeText}>Admin</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notificaciones</Text>
          <View style={{ gap: 8 }}>
            <ToggleRow
              label="Push notifications"
              description="Recibir notificaciones en el dispositivo"
              checked={notifications}
              onChange={setNotifications}
            />
            <ToggleRow
              label="Email"
              description="Resumen diario por correo"
              checked={emailNotif}
              onChange={setEmailNotif}
            />
          </View>
        </View>

        {settingsSections.map((section, idx) => (
          <View key={idx} style={{ gap: 8, marginTop: 12 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIdx) => (
              <ListCard
                key={itemIdx}
                title={item.label}
                leftContent={
                  <View style={styles.itemIcon}>
                    <Ionicons name={item.icon} size={18} color="#4B5563" />
                  </View>
                }
                showChevron
              />
            ))}
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          <ListCard
            title="Cerrar sesión"
            leftContent={
              <View style={[styles.itemIcon, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              </View>
            }
            showChevron
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  profileEmail: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  badge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  badgeText: { color: "#4338CA", fontSize: 12, fontWeight: "700" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#6B7280", marginLeft: 4 },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});

