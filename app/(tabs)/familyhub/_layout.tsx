/**
 * FamilyHub Layout
 * This layout ensures the familyhub route is properly recognized by Expo Router
 */
import { Stack } from 'expo-router';

export default function FamilyHubLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

