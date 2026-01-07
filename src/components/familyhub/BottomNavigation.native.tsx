import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabId = "home" | "plan" | "family" | "house" | "more";

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "plan", label: "Plan", icon: "calendar" },
  { id: "family", label: "Familia", icon: "people" },
  { id: "house", label: "Hogar", icon: "business" },
  { id: "more", label: "Más", icon: "menu" },
];

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tab}
            >
              <View style={styles.tabContent}>
                {isActive && <View style={styles.indicator} />}

                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isActive ? "#4F46E5" : "#6B7280"}
                />

                <Text
                  style={[
                    styles.label,
                    isActive && styles.labelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    zIndex: 50,
  },
  content: {
    flexDirection: "row",
    maxWidth: 390,
    alignSelf: "center",
    width: "100%",
  },
  tab: {
    flex: 1,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -24,
    width: 48,
    height: 4,
    backgroundColor: "#4F46E5",
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  labelActive: {
    color: "#4F46E5",
  },
});
