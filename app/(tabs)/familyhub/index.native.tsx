import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { ListCard } from "@/components/familyhub/ListCard";
import { AppHeader } from "@/components/familyhub/AppHeader";

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  points: number;
  tasksCompleted: number;
  rank: number;
}

export default function FamilyHub() {
  const members: FamilyMember[] = [
    { id: "1", name: "Mamá (Sarah)", avatar: "👩", role: "Admin", points: 1250, tasksCompleted: 42, rank: 1 },
    { id: "2", name: "Papá (Robert)", avatar: "👨", role: "Admin", points: 1180, tasksCompleted: 38, rank: 2 },
    { id: "3", name: "Emma", avatar: "👧", role: "Miembro", points: 890, tasksCompleted: 28, rank: 3 },
    { id: "4", name: "Jake", avatar: "👦", role: "Miembro", points: 720, tasksCompleted: 21, rank: 4 },
  ];

  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  const totalTasks = members.reduce((sum, m) => sum + m.tasksCompleted, 0);

  return (
    <View style={styles.screen}>
      <AppHeader title="Familia" subtitle="Puntos, ranking y motivación" showAddButton={false} />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Total familiar</Text>
            <Text style={styles.heroValue}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.heroSub}>puntos acumulados</Text>
          </View>
          <View style={styles.heroIcon}>
            <Text style={{ fontSize: 28 }}>🏆</Text>
          </View>
        </View>

        <View style={styles.row2}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{members.length}</Text>
            <Text style={styles.statLabel}>miembros</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalTasks}</Text>
            <Text style={styles.statLabel}>tareas completadas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Ranking de la semana</Text>
          <View style={styles.card}>
            {members.slice(0, 3).map((member) => {
              const medalEmoji = member.rank === 1 ? "🥇" : member.rank === 2 ? "🥈" : "🥉";
              return (
                <View key={member.id} style={styles.rankRow}>
                  <Text style={styles.medal}>{medalEmoji}</Text>
                  <View style={styles.avatarSmall}>
                    <Text style={{ fontSize: 18 }}>{member.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rankName}>{member.name}</Text>
                    <Text style={styles.rankMeta}>{member.tasksCompleted} tareas</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.rankPoints}>{member.points}</Text>
                    <Text style={styles.rankMeta}>pts</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Miembros de la familia</Text>
            <Pressable style={styles.addMini}>
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>+</Text>
            </Pressable>
          </View>
          <View style={{ gap: 12 }}>
            {members.map((member) => (
              <ListCard
                key={member.id}
                title={member.name}
                subtitle={member.role}
                leftContent={
                  <View style={styles.avatarMedium}>
                    <Text style={{ fontSize: 20 }}>{member.avatar}</Text>
                  </View>
                }
                rightContent={
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "700", color: "#111827" }}>{member.points} pts</Text>
                    <Text style={{ color: "#6B7280", fontSize: 12 }}>{member.tasksCompleted} tareas</Text>
                  </View>
                }
                showChevron
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  hero: {
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  heroLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 4 },
  heroValue: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  heroSub: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  row2: { flexDirection: "row", gap: 12, marginTop: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    gap: 12,
  },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  medal: { fontSize: 18, width: 28, textAlign: "center" },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  rankName: { fontWeight: "700", color: "#111827", fontSize: 14 },
  rankMeta: { color: "#6B7280", fontSize: 12 },
  rankPoints: { fontWeight: "700", color: "#111827" },
  addMini: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMedium: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

