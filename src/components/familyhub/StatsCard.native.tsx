import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatsCardProps {
  icon?: string; // Nombre del icono de Ionicons (ej: "flash", "checkmark-circle")
  emoji?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "purple" | "emerald" | "amber" | "rose" | "indigo";
  onClick?: () => void;
  className?: string;
}

const colorGradients = {
  blue: ["#3B82F6", "#2563EB"],
  purple: ["#A855F7", "#9333EA"],
  emerald: ["#10B981", "#059669"],
  amber: ["#F59E0B", "#D97706"],
  rose: ["#F43F5E", "#E11D48"],
  indigo: ["#6366F1", "#4F46E5"],
};

// Componente seguro que usa View con backgroundColor en lugar de LinearGradient
// hasta que se reconstruya la app nativa con expo-linear-gradient vinculado
const SafeGradient = ({ colors, children, style }: { colors: string[]; children: React.ReactNode; style?: any }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

export function StatsCard({
  icon,
  emoji,
  title,
  value,
  subtitle,
  color = "indigo",
  onClick,
  className,
}: StatsCardProps) {
  const gradient = colorGradients[color];
  const isClickable = !!onClick;

  const content = (
    <SafeGradient colors={gradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : icon ? (
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={24} color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </SafeGradient>
  );

  if (isClickable) {
    return (
      <Pressable
        onPress={onClick}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressable: {
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  emoji: {
    fontSize: 32,
    flexShrink: 0,
    marginLeft: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: 8,
  },
});
