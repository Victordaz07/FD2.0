import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ListCard } from "@/components/familyhub/ListCard";
import { Ionicons } from "@expo/vector-icons";
import { signOutUser } from "@/lib/auth/authService";
import { useAuthStore } from "@/store/authStore";

const menuSections = [
  {
    title: "Cuenta",
    items: [
      { icon: "person-circle" as const, label: "Mi perfil", route: "/(tabs)/familyhub/settings" },
      { icon: "shield-checkmark" as const, label: "Seguridad", badge: "PIN, Face ID", route: "/(tabs)/familyhub/settings" },
    ],
  },
  {
    title: "Preferencias",
    items: [
      { icon: "settings-outline" as const, label: "Ajustes generales", route: "/(tabs)/familyhub/settings" },
      { icon: "color-palette-outline" as const, label: "Personalización", route: "/(tabs)/familyhub/personalization" },
      { icon: "notifications-outline" as const, label: "Notificaciones", route: "/(tabs)/familyhub/settings" },
      { icon: "globe-outline" as const, label: "Idioma", badge: "Español", route: "/(tabs)/familyhub/settings" },
    ],
  },
  {
    title: "Soporte",
    items: [{ icon: "help-circle-outline" as const, label: "Centro de ayuda", route: null }],
  },
];

export default function More() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const handleNavigation = (route: string | null) => {
    if (route) {
      router.push(route as any);
    } else {
      // Para "Centro de ayuda" o rutas no implementadas
      Alert.alert("Próximamente", "Esta funcionalidad estará disponible pronto.");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOutUser();
              setUser(null);
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
              Alert.alert("Error", "No se pudo cerrar sesión. Intenta nuevamente.");
            }
          },
        },
      ]
    );
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Más</Text>
        <Text style={styles.subtitle}>Configuración y ajustes</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontSize: 28 }}>👨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>
                {user?.displayName || user?.email?.split("@")[0] || "Usuario"}
              </Text>
              <Text style={styles.profileEmail}>{user?.email || ""}</Text>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>Admin</Text>
              </View>
            </View>
          </View>
        </View>

        {menuSections.map((section, idx) => (
          <View key={idx} style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={{ gap: 8 }}>
              {section.items.map((item, itemIdx) => (
                <ListCard
                  key={itemIdx}
                  title={item.label}
                  subtitle={item.badge}
                  leftContent={
                    <View style={styles.itemIcon}>
                      <Ionicons name={item.icon} size={18} color="#4B5563" />
                    </View>
                  }
                  showChevron
                  onClick={() => handleNavigation(item.route)}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={{ marginTop: 20 }}>
          <ListCard
            title="Cerrar sesión"
            leftContent={
              <View style={[styles.itemIcon, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              </View>
            }
            showChevron
            onClick={handleSignOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  profileCard: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    padding: 16,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  profileEmail: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  badge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});

