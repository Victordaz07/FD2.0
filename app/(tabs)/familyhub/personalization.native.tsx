import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ToggleRow } from "@/components/familyhub/ToggleRow";
import { Toast, ToastType } from "@/components/familyhub/Toast";
import { Ionicons } from "@expo/vector-icons";

type ThemeMode = "light" | "dark" | "auto";
type ColorPalette = "indigo" | "blue" | "purple" | "emerald" | "rose";

interface Widget {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NavPage {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export default function Personalization() {
  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [colorPalette, setColorPalette] = useState<ColorPalette>("indigo");
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "summary",
      name: "Resumen diario",
      description: "Vista rápida de tareas y metas",
      enabled: true,
    },
    {
      id: "calendar",
      name: "Próximos eventos",
      description: "Calendario de la semana",
      enabled: true,
    },
    {
      id: "finances",
      name: "Estado financiero",
      description: "Gastos y ahorros del mes",
      enabled: false,
    },
    {
      id: "ranking",
      name: "Ranking familiar",
      description: "Top 3 de la familia",
      enabled: true,
    },
  ]);

  const [navPages, setNavPages] = useState<NavPage[]>([
    { id: "home", name: "Inicio", icon: "🏠", enabled: true },
    { id: "calendar", name: "Calendario", icon: "📅", enabled: true },
    { id: "tasks", name: "Tareas", icon: "✅", enabled: true },
    { id: "finances", name: "Finanzas", icon: "💰", enabled: true },
    { id: "family", name: "Familia", icon: "👨‍👩‍👧‍👦", enabled: true },
    { id: "goals", name: "Metas", icon: "🎯", enabled: false },
  ]);

  const themes = [
    { id: "light", label: "Claro", icon: "sunny" as const },
    { id: "dark", label: "Oscuro", icon: "moon" as const },
    { id: "auto", label: "Auto", icon: "phone-portrait" as const },
  ];

  const colorPalettes = [
    { id: "indigo", name: "Índigo", color: "#4F46E5" },
    { id: "blue", name: "Azul", color: "#3B82F6" },
    { id: "purple", name: "Morado", color: "#A855F7" },
    { id: "emerald", name: "Esmeralda", color: "#10B981" },
    { id: "rose", name: "Rosa", color: "#F43F5E" },
  ];

  const handleNavPageToggle = (id: string, enabled: boolean) => {
    const enabledCount = navPages.filter((p) => p.enabled).length;
    if (enabled && enabledCount >= 5) {
      setToast({
        show: true,
        type: "warning",
        message: "Máximo 5 páginas en la navegación",
      });
      return;
    }
    setNavPages(navPages.map((p) => (p.id === id ? { ...p, enabled } : p)));
  };

  const handleSave = () => {
    setToast({
      show: true,
      type: "success",
      message: "Preferencias guardadas correctamente",
    });
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Personalización"
        subtitle="Personaliza tu experiencia"
        showAddButton={false}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tema</Text>
          <View style={styles.card}>
            <View style={styles.grid3}>
              {themes.map(({ id, label, icon }) => (
                <Pressable
                  key={id}
                  onPress={() => setTheme(id as ThemeMode)}
                  style={[
                    styles.optionCard,
                    theme === id && styles.optionCardActive,
                  ]}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons
                      name={icon}
                      size={18}
                      color={theme === id ? "#4F46E5" : "#4B5563"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      theme === id && styles.optionLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paleta de color</Text>
          <View style={styles.card}>
            <View style={styles.grid5}>
              {colorPalettes.map((palette) => (
                <Pressable
                  key={palette.id}
                  onPress={() => setColorPalette(palette.id as ColorPalette)}
                  style={[
                    styles.paletteCircle,
                    { backgroundColor: palette.color },
                    colorPalette === palette.id && styles.paletteSelected,
                  ]}
                >
                  {colorPalette === palette.id && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widgets</Text>
          <View style={styles.card}>
            {widgets.map((widget) => (
              <ToggleRow
                key={widget.id}
                label={widget.name}
                description={widget.description}
                checked={widget.enabled}
                onChange={(value) =>
                  setWidgets((ws) =>
                    ws.map((w) =>
                      w.id === widget.id ? { ...w, enabled: value } : w
                    )
                  )
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navegación (máx. 5)</Text>
          <View style={styles.card}>
            {navPages.map((page) => (
              <ToggleRow
                key={page.id}
                label={`${page.icon} ${page.name}`}
                checked={page.enabled}
                onChange={(value) => handleNavPageToggle(page.id, value)}
              />
            ))}
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryText}>Guardar cambios</Text>
        </Pressable>
      </ScrollView>

      <Toast
        isVisible={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  grid3: { flexDirection: "row", gap: 8 },
  grid5: { flexDirection: "row", gap: 12 },
  optionCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  optionCardActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: { fontSize: 14, fontWeight: "600", color: "#4B5563" },
  optionLabelActive: { color: "#4F46E5" },
  paletteCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteSelected: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
