import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createNotificationChannel } from '@/lib/push';
import { useAuthStore } from '@/store/authStore';
import { registerDeviceToken } from '@/lib/push';

// #region agent log - DISABLED
// fetch('http://127.0.0.1:7243/ingest/...') - Commented out to avoid connection errors
// #endregion

export default function TabsLayout() {
  const { user } = useAuthStore();

  // #region agent log - DISABLED
  // useEffect(() => { fetch('http://127.0.0.1:7243/ingest/...') }) - Commented out
  // #endregion

  useEffect(() => {
    // #region agent log - DISABLED
    // fetch('http://127.0.0.1:7243/ingest/...') - Commented out
    // #endregion
    // Create Android notification channel on mount
    createNotificationChannel().catch((error) => {
      // #region agent log - DISABLED
      // fetch('http://127.0.0.1:7243/ingest/...') - Commented out
      // #endregion
      console.error('Error creating notification channel:', error);
    });

    // Register device token when user is available
    if (user?.uid) {
      // #region agent log - DISABLED
      // fetch('http://127.0.0.1:7243/ingest/...') - Commented out
      // #endregion
      registerDeviceToken(user.uid).catch((error) => {
        // #region agent log - DISABLED
        // fetch('http://127.0.0.1:7243/ingest/...') - Commented out
        // #endregion
        console.error('Error registering device token:', error);
      });
    }
  }, [user?.uid]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* Home / Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Plan */}
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      {/* FamilyHub / Familia */}
      <Tabs.Screen
        name="familyhub"
        options={{
          title: 'Familia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* House / Hogar */}
      <Tabs.Screen
        name="house"
        options={{
          title: 'Hogar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      {/* More / Más */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />

      {/* Tabs ocultos - Accesibles por navegación pero no visibles en el tab bar */}
      <Tabs.Screen
        name="tasks"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="tasks-manage"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="allowance"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="attention"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="legacy-home"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
      <Tabs.Screen
        name="legacy-plan"
        options={{
          href: null, // Oculta del tab bar
        }}
      />
    </Tabs>
  );
}

