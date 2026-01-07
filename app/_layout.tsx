import { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Platform } from "react-native";
import "../src/global.css";

type NotificationSubscription = { remove: () => void };

export default function RootLayout() {
  const notificationListener = useRef<NotificationSubscription | null>(null);
  const responseListener = useRef<NotificationSubscription | null>(null);

  useEffect(() => {
    let NotificationsModule: typeof import("expo-notifications") | null = null;

    // Lazy load notifications module to avoid errors in Expo Go
    // Only initialize on native platforms (not web)
    const initNotifications = async () => {
      // Skip notifications on web platform
      if (Platform.OS === "web") {
        return;
      }

      try {
        NotificationsModule = await import("expo-notifications");

        // Handle notification received while app is foregrounded
        notificationListener.current =
          NotificationsModule.addNotificationReceivedListener(
            (notification) => {
              // Handle foreground notifications if needed
              // For ATTENTION_RING, we'll handle via response listener
            }
          );

        // Handle notification response (user taps notification)
        responseListener.current =
          NotificationsModule.addNotificationResponseReceivedListener(
            (response) => {
              const data = response.notification.request.content.data;

              if (
                data?.type === "ATTENTION_RING" &&
                data.requestId &&
                data.familyId
              ) {
                // Navigate to AttentionRingScreen
                router.push(
                  `/(tabs)/attention/ring?requestId=${data.requestId}&familyId=${data.familyId}`
                );
              }
            }
          );

        // Check if app was opened from a notification (app was killed)
        NotificationsModule.getLastNotificationResponseAsync().then(
          (response) => {
            if (response) {
              const data = response.notification.request.content.data;

              if (
                data?.type === "ATTENTION_RING" &&
                data.requestId &&
                data.familyId
              ) {
                // Small delay to ensure router is ready
                setTimeout(() => {
                  router.push(
                    `/(tabs)/attention/ring?requestId=${data.requestId}&familyId=${data.familyId}`
                  );
                }, 500);
              }
            }
          }
        );
      } catch (error) {
        console.warn(
          "Notifications not available (likely Expo Go limitation):",
          error
        );
      }
    };

    initNotifications();

    return () => {
      if (notificationListener.current) {
        try {
          if (typeof notificationListener.current.remove === "function") {
            notificationListener.current.remove();
          }
        } catch (error) {
          console.warn("Error removing notification listener:", error);
        }
      }
      if (responseListener.current) {
        try {
          if (typeof responseListener.current.remove === "function") {
            responseListener.current.remove();
          }
        } catch (error) {
          console.warn("Error removing response listener:", error);
        }
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </SafeAreaProvider>
  );
}
