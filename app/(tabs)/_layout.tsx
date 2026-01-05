import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { createNotificationChannel } from '@/lib/push';
import { useAuthStore } from '@/store/authStore';
import { registerDeviceToken } from '@/lib/push';

// #region agent log
fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:6',message:'Module loading - tabs layout',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion

export default function TabsLayout() {
  const { user } = useAuthStore();

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:12',message:'TabsLayout rendered',data:{hasUser:!!user,uid:user?.uid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  }, [user]);
  // #endregion

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:18',message:'useEffect started',data:{hasUser:!!user,uid:user?.uid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    // Create Android notification channel on mount
    createNotificationChannel().catch((error) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:22',message:'createNotificationChannel error caught',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('Error creating notification channel:', error);
    });

    // Register device token when user is available
    if (user?.uid) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:27',message:'Calling registerDeviceToken',data:{uid:user.uid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      registerDeviceToken(user.uid).catch((error) => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'(tabs)/_layout.tsx:29',message:'registerDeviceToken error caught',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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

