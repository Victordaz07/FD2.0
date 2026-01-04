import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { useCalendarStore } from '@/store/calendarStore';
import { listEventsByRange } from '@/lib/db/events';
import { CalendarEvent } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { isParentalRole } from '@/lib/policy/agePolicy';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function CalendarScreen() {
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const { events, setEvents, loading, setLoading } = useCalendarStore();
  const { toast, showError, hideToast } = useToast();

  useEffect(() => {
    if (currentFamily) {
      loadEvents();
    }
  }, [currentFamily]);

  const loadEvents = async () => {
    if (!currentFamily) return;

    setLoading(true);
    try {
      // Load events for current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const startTimestamp = Timestamp.fromDate(startOfMonth);
      const endTimestamp = Timestamp.fromDate(endOfMonth);

      const result = await listEventsByRange(
        currentFamily.id,
        startTimestamp,
        endTimestamp
      );
      setEvents(result.events);
    } catch (error: any) {
      console.error('Error loading events:', error);
      showError(error.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }: { item: CalendarEvent }) => {
    return (
      <TouchableOpacity style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          {item.visibility === 'parents_only' && (
            <Text style={styles.visibilityBadge}>Solo padres</Text>
          )}
        </View>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
        <Text style={styles.eventDate}>
          {item.startDate.toDate().toLocaleDateString()}
          {item.endDate && item.startDate.toDate().getTime() !== item.endDate.toDate().getTime() && (
            <> - {item.endDate.toDate().toLocaleDateString()}</>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  const currentMember = members.find((m) => m.uid === user?.uid);
  const isParent = currentMember && isParentalRole(currentMember.role);
  const canCreate = isParent || (currentFamily?.familyPolicy?.calendarCreateRoles?.includes(currentMember?.role as any));

  if (loading && events.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario</Text>
        {canCreate && (
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.push('/(tabs)/calendar/new')}
          >
            <Text style={styles.newButtonText}>Nuevo Evento</Text>
          </TouchableOpacity>
        )}
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay eventos este mes</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadEvents}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  eventCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  visibilityBadge: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
  },
});

