/**
 * Root index - redirects based on auth state
 */
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { onAuthChange } from '@/lib/auth/authService';
import { getUser } from '@/lib/db/users';
import { User } from '@/lib/types';

export default function Index() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  // Show loading state (you can add a loading screen here)
  if (useAuthStore((state) => state.loading)) {
    return null; // or return a loading screen
  }

  // Redirect based on auth state
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If user has no active family, redirect to onboarding
  if (!user.activeFamilyId) {
    return <Redirect href="/(onboarding)/create-family" />;
  }

  // User is authenticated and has a family, go to home
  return <Redirect href="/(tabs)" />;
}

