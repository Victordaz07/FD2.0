import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string; // Nombre del icono de Ionicons
  variant: "primary" | "success" | "error" | "warning" | "info";
  className?: string;
}

const gradients = {
  primary: ["#6366F1", "#4F46E5"],
  success: ["#10B981", "#059669"],
  error: ["#F43F5E", "#E11D48"],
  warning: ["#F59E0B", "#D97706"],
  info: ["#3B82F6", "#2563EB"],
};

// Componente seguro que usa View con backgroundColor en lugar de LinearGradient
const SafeGradient = ({ colors, children, style }: { colors: string[]; children: React.ReactNode; style?: any }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  variant,
  className,
}: SummaryCardProps) {
  const gradient = gradients[variant];

  return (
    <SafeGradient colors={gradient} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={20} color="#FFFFFF" />
          </View>
        )}
      </View>
    </SafeGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
