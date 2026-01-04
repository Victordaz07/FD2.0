import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { useAllowanceStore } from '@/store/allowanceStore';
import { listEntriesForMember, computeBalance } from '@/lib/db/allowanceLedger';
import { AllowanceLedgerEntry } from '@/lib/types';
import { isParentalRole } from '@/lib/policy/agePolicy';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function AllowanceScreen() {
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const { entries, balance, setEntries, setBalance, loading, setLoading } = useAllowanceStore();
  const [selectedMemberUid, setSelectedMemberUid] = useState<string | null>(null);
  const { toast, showError, hideToast } = useToast();

  useEffect(() => {
    if (currentFamily && user) {
      const currentMember = members.find((m) => m.uid === user.uid);
      const isParent = currentMember && isParentalRole(currentMember.role);

      if (isParent) {
        // Parents see all members, default to first non-parent
        const firstChild = members.find((m) => !isParentalRole(m.role));
        setSelectedMemberUid(firstChild?.uid || user.uid);
      } else {
        // Non-parents see only their own
        setSelectedMemberUid(user.uid);
      }
    }
  }, [currentFamily, user, members]);

  useEffect(() => {
    if (currentFamily && selectedMemberUid) {
      loadBalance();
    }
  }, [currentFamily, selectedMemberUid]);

  const loadBalance = async () => {
    if (!currentFamily || !selectedMemberUid) return;

    setLoading(true);
    try {
      const result = await listEntriesForMember(currentFamily.id, selectedMemberUid);
      setEntries(result.entries);
      const computedBalance = await computeBalance(currentFamily.id, selectedMemberUid);
      setBalance(computedBalance);
    } catch (error: any) {
      console.error('Error loading balance:', error);
      showError(error.message || 'Error al cargar el balance');
    } finally {
      setLoading(false);
    }
  };

  const renderEntry = ({ item }: { item: AllowanceLedgerEntry }) => {
    const member = members.find((m) => m.uid === item.memberUid);
    const isCredit = item.type === 'credit';

    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryDescription}>{item.description}</Text>
          <Text
            style={[styles.entryAmount, isCredit ? styles.creditAmount : styles.debitAmount]}
          >
            {isCredit ? '+' : '-'}
            {item.amountCents !== undefined && item.amountCents !== null
              ? `$${(item.amountCents / 100).toFixed(2)}`
              : ''}
            {item.points !== undefined && item.points !== null ? `${item.points} pts` : ''}
          </Text>
        </View>
        <Text style={styles.entryDate}>
          {item.entryDate.toDate().toLocaleDateString()}
        </Text>
        <Text style={styles.entrySource}>{item.source}</Text>
      </View>
    );
  };

  const currentMember = members.find((m) => m.uid === user?.uid);
  const isParent = currentMember && isParentalRole(currentMember.role);
  const selectedMember = members.find((m) => m.uid === selectedMemberUid);

  if (loading && entries.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesada</Text>

      {isParent && (
        <View style={styles.memberSelector}>
          <Text style={styles.selectorLabel}>Miembro:</Text>
          <FlatList
            horizontal
            data={members.filter((m) => !isParentalRole(m.role))}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.memberButton,
                  selectedMemberUid === item.uid && styles.memberButtonActive,
                ]}
                onPress={() => setSelectedMemberUid(item.uid)}
              >
                <Text
                  style={[
                    styles.memberButtonText,
                    selectedMemberUid === item.uid && styles.memberButtonTextActive,
                  ]}
                >
                  {item.uid === user?.uid ? 'Tú' : `Usuario ${item.uid.substring(0, 8)}`}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance Actual</Text>
        <Text style={styles.balanceAmount}>
          ${(balance.amountCents / 100).toFixed(2)}
        </Text>
        {balance.points > 0 && (
          <Text style={styles.balancePoints}>{balance.points} puntos</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Historial</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay transacciones</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadBalance}
        />
      )}
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
    marginBottom: 16,
  },
  memberSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  memberButtonActive: {
    backgroundColor: '#007AFF',
  },
  memberButtonText: {
    fontSize: 14,
    color: '#333',
  },
  memberButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  balancePoints: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  entryCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDescription: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditAmount: {
    color: '#4caf50',
  },
  debitAmount: {
    color: '#f44336',
  },
  entryDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  entrySource: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
});

