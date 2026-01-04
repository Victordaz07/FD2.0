import { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useFamilyStore } from '@/store/familyStore';
import { getMember } from '@/lib/db/members';
import { isParentalRole } from '@/lib/policy/agePolicy';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const { currentFamily, members } = useFamilyStore();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
    if (!user || !currentFamily) {
      setHasAccess(false);
      return;
    }

    // Try to find user in members store first (faster)
    const currentMember = members.find((m) => m.uid === user.uid);
    
    if (currentMember) {
      setHasAccess(isParentalRole(currentMember.role));
      return;
    }

    // If not in store, fetch from database
    try {
      const member = await getMember(currentFamily.id, user.uid);
      if (member) {
        setHasAccess(isParentalRole(member.role));
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setHasAccess(false);
    }
    };

    checkAccess();
  }, [user, currentFamily, members]);

  // Show loading state while checking
  if (hasAccess === null) {
    return null; // Or return a loading screen
  }

  // Redirect to tabs if user doesn't have access
  if (!hasAccess) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="members" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

