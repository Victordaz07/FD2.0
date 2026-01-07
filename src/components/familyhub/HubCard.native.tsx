import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HubCardProps {
  icon?: string; // Nombre del icono de Ionicons
  title: string;
  description: string;
  value?: string | number;
  progress?: number;
  badge?: string;
  color?: "blue" | "purple" | "emerald" | "amber" | "rose";
  onClick: () => void;
  className?: string;
}

const colorStyles = {
  blue: {
    iconBg: "#3B82F6", // Azul sólido
    iconColor: "#FFFFFF",
    progressBg: "#9333EA", // Púrpura para la barra
  },
  purple: {
    iconBg: "#9333EA", // Púrpura sólido
    iconColor: "#FFFFFF",
    progressBg: "#9333EA",
  },
  emerald: {
    iconBg: "#10B981", // Verde sólido
    iconColor: "#FFFFFF",
    progressBg: "#10B981",
  },
  amber: {
    iconBg: "#F59E0B",
    iconColor: "#FFFFFF",
    progressBg: "#F59E0B",
  },
  rose: {
    iconBg: "#F43F5E",
    iconColor: "#FFFFFF",
    progressBg: "#F43F5E",
  },
};

export function HubCard({
  icon,
  title,
  description,
  value,
  progress,
  badge,
  color = "blue",
  onClick,
  className,
}: HubCardProps) {
  const stylesConfig = colorStyles[color];

  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: stylesConfig.iconBg },
            ]}
          >
            {icon && (
              <Ionicons
                name={icon as any}
                size={22}
                color={stylesConfig.iconColor}
              />
            )}
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {value !== undefined && (
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>
                {badge && <Text style={styles.badge}>{badge}</Text>}
              </View>
            )}

            {progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: stylesConfig.progressBg,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressValue}>{progress}%</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F9FAFB", // Fondo gris claro como en la imagen
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Círculo perfecto
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 18,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    minWidth: 35,
  },
});
