import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { createNotificationChannel } from '@/lib/push';
import { useAuthStore } from '@/store/authStore';
import { registerDeviceToken } from '@/lib/push';

export default function TabsLayout() {
  const { user } = useAuthStore();

  useEffect(() => {
    // Create Android notification channel on mount
    createNotificationChannel().catch((error) => {
      console.error('Error creating notification channel:', error);
    });

    // Register device token when user is available
    if (user?.uid) {
      registerDeviceToken(user.uid).catch((error) => {
        console.error('Error registering device token:', error);
      });
    }
  }, [user?.uid]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}

