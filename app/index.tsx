/**
 * Root index - redirects based on auth state
 */
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { onAuthChange, getCurrentAuthUser } from '@/lib/auth/authService';
import { getUser } from '@/lib/db/users';

export default function Index() {
  const { user, setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    console.log('[Index] Setting up auth listener...');
    
    // Configurar listener de cambios de autenticación
    // Firebase Auth ya maneja la persistencia automáticamente
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('[Index] Auth state changed', { 
        hasFirebaseUser: !!firebaseUser, 
        uid: firebaseUser?.uid 
      });
      
      if (firebaseUser) {
        try {
          console.log('[Index] Loading user data from Firestore...');
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            console.log('[Index] User data loaded', { 
              uid: userData.uid, 
              email: userData.email,
              hasActiveFamily: !!userData.activeFamilyId 
            });
            setUser(userData);
          } else {
            console.warn('[Index] User data not found in Firestore');
            setUser(null);
          }
        } catch (error) {
          console.error('[Index] Error loading user:', error);
          setUser(null);
        }
      } else {
        console.log('[Index] No Firebase user, clearing auth store');
        setUser(null);
      }
      setLoading(false);
    });

    // Verificar si ya hay un usuario de Firebase al iniciar
    // Esto ayuda a restaurar la sesión más rápido
    const currentFirebaseUser = getCurrentAuthUser();
    if (currentFirebaseUser) {
      console.log('[Index] Found existing Firebase session, loading user...');
      getUser(currentFirebaseUser.uid)
        .then((userData) => {
          if (userData) {
            console.log('[Index] Loaded user from existing session:', { uid: userData.uid });
            setUser(userData);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('[Index] Error loading user from existing session:', error);
          setLoading(false);
        });
    } else {
      // No hay sesión de Firebase, el listener se encargará
      setLoading(false);
    }

    return unsubscribe;
  }, [setUser, setLoading]);

  console.log('[Index] Rendering', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email,
    hasActiveFamily: !!user?.activeFamilyId 
  });

  // Show loading state (you can add a loading screen here)
  if (loading) {
    console.log('[Index] Showing loading state');
    return null; // or return a loading screen
  }

  // Redirect based on auth state
  if (!user) {
    console.log('[Index] No user, redirecting to login');
    return <Redirect href="/(auth)/login" />;
  }

  // If user has no active family, redirect to onboarding
  if (!user.activeFamilyId) {
    console.log('[Index] User has no active family, redirecting to onboarding');
    return <Redirect href="/(onboarding)/create-family" />;
  }

  // User is authenticated and has a family, go to FamilyHub (new UI)
  console.log('[Index] User authenticated with family, redirecting to FamilyHub');
  return <Redirect href="/(tabs)/familyhub" />;
}


