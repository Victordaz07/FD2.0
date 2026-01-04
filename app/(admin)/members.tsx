import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getFamilyMembers } from '@/lib/db/members';
import { useFamilyStore } from '@/store/familyStore';
import { useAuthStore } from '@/store/authStore';
import { FamilyMember, Role } from '@/lib/types';

export default function MembersScreen() {
  const { currentFamily } = useFamilyStore();
  const { user } = useAuthStore();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentFamily) {
      loadMembers();
    }
  }, [currentFamily]);

  const loadMembers = async () => {
    if (!currentFamily) return;

    setLoading(true);
    try {
      const familyMembers = await getFamilyMembers(currentFamily.id);
      setMembers(familyMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMember = ({ item }: { item: FamilyMember }) => {
    const isCurrentUser = item.uid === user?.uid;
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.uid === user?.uid ? 'Tú' : `Usuario ${item.uid.substring(0, 8)}`}
          </Text>
          <Text style={styles.memberRole}>{item.role}</Text>
          {item.ageGroup && (
            <Text style={styles.memberAgeGroup}>Grupo: {item.ageGroup}</Text>
          )}
        </View>
        {isCurrentUser && <Text style={styles.currentUserBadge}>Tu</Text>}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Miembros de la Familia</Text>
      {currentFamily && (
        <Text style={styles.familyName}>{currentFamily.name}</Text>
      )}
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.uid}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  familyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  memberAgeGroup: {
    fontSize: 12,
    color: '#666',
  },
  currentUserBadge: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});

