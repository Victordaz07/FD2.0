import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { AppHeader } from "@/components/familyhub/AppHeader";
import { ListCard } from "@/components/familyhub/ListCard";

type ViewMode = "list" | "ranking";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasksCompleted: number;
  goalsAchieved: number;
  points: number;
  streak: number;
}

export default function Family() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const members: FamilyMember[] = [
    { id: "mom", name: "Mamá (Sarah)", avatar: "👩", role: "Admin", tasksCompleted: 142, goalsAchieved: 18, points: 1250, streak: 15 },
    { id: "dad", name: "Papá (Robert)", avatar: "👨", role: "Admin", tasksCompleted: 127, goalsAchieved: 15, points: 1180, streak: 12 },
    { id: "emma", name: "Emma", avatar: "👧", role: "Miembro", tasksCompleted: 89, goalsAchieved: 10, points: 890, streak: 8 },
    { id: "jake", name: "Jake", avatar: "👦", role: "Miembro", tasksCompleted: 67, goalsAchieved: 7, points: 720, streak: 5 },
  ];

  const sortedByPoints = [...members].sort((a, b) => b.points - a.points);

  return (
    <View style={styles.screen}>
      <AppHeader title="Familia" subtitle={`${members.length} miembros`} showAddButton={false} />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.tabs}>
          {[
            { id: "list", label: "Lista" },
            { id: "ranking", label: "Ranking" },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setViewMode(tab.id as ViewMode)}
              style={[styles.tab, viewMode === tab.id && styles.tabActive]}
            >
              <Text style={[styles.tabText, viewMode === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {viewMode === "list" && (
          <View style={{ gap: 12 }}>
            <Text style={styles.sectionTitle}>Miembros</Text>
            {members.map((member) => (
              <ListCard
                key={member.id}
                title={member.name}
                subtitle={member.role}
                leftContent={
                  <View style={styles.avatar}>
                    <Text style={{ fontSize: 18 }}>{member.avatar}</Text>
                  </View>
                }
                rightContent={
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.points}>{member.points} pts</Text>
                    <Text style={styles.meta}>{member.tasksCompleted} tareas</Text>
                  </View>
                }
                showChevron
              />
            ))}
          </View>
        )}

        {viewMode === "ranking" && (
          <View style={{ gap: 12 }}>
            <Text style={styles.sectionTitle}>Tabla de posiciones</Text>
            {sortedByPoints.map((member, index) => {
              const rank = index + 1;
              return (
                <View
                  key={member.id}
                  style={[
                    styles.rankCard,
                    rank === 1 && styles.rankFirst,
                  ]}
                >
                  <View style={styles.rankRow}>
                    <Text style={styles.rankNumber}>#{rank}</Text>
                    <View style={styles.avatarSmall}>
                      <Text style={{ fontSize: 18 }}>{member.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rankName}>{member.name}</Text>
                      <Text style={styles.meta}>{member.tasksCompleted} tareas</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.points}>{member.points}</Text>
                      <Text style={styles.meta}>pts</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  tabs: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 6,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: { backgroundColor: "#EEF2FF" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#4F46E5" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  points: { fontWeight: "700", color: "#111827" },
  meta: { color: "#6B7280", fontSize: 12 },
  rankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  rankFirst: {
    borderColor: "#FCD34D",
    backgroundColor: "#FFFBEB",
  },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rankNumber: { fontWeight: "800", color: "#4F46E5", width: 28, textAlign: "center" },
  rankName: { fontWeight: "700", color: "#111827" },
});

