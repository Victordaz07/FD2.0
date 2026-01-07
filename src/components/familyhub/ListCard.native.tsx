import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

interface ListCardProps {
  title: string;
  subtitle?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function ListCard({
  title,
  subtitle,
  leftContent,
  rightContent,
  onClick,
  showChevron = false,
  className,
}: ListCardProps) {
  const isClickable = !!onClick;

  const content = (
    <View style={styles.container}>
      <View style={styles.content}>
        {leftContent && <View style={styles.leftContent}>{leftContent}</View>}

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightContent && (
          <View style={styles.rightContent}>{rightContent}</View>
        )}

        {showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9CA3AF"
            style={styles.chevron}
          />
        )}
      </View>
    </View>
  );

  if (isClickable) {
    return (
      <Pressable
        onPress={onClick}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pressable: {
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftContent: {
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: "500",
    color: "#111827",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  rightContent: {
    flexShrink: 0,
  },
  chevron: {
    flexShrink: 0,
  },
});
