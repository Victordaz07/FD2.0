import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAttentionStore } from '@/store/attentionStore';
import { getAttentionRequest } from '@/lib/db/attentionRequests';
import { getMemberDisplayName } from '@/lib/helpers/memberHelpers';
import { AttentionRequest } from '@/lib/types';
import { Audio } from 'expo-av';
import { useToast } from '@/hooks/useToast';

export default function AttentionRingScreen() {
  const { requestId, familyId } = useLocalSearchParams<{ requestId: string; familyId: string }>();
  const { ack, loading } = useAttentionStore();
  const { showError } = useToast();
  
  const [request, setRequest] = useState<AttentionRequest | null>(null);
  const [callerName, setCallerName] = useState<string>('Un padre/tutor');
  const [countdown, setCountdown] = useState<number>(0);
  const [expired, setExpired] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load request
  useEffect(() => {
    if (!requestId || !familyId) {
      Alert.alert('Error', 'Faltan parámetros requeridos');
      router.back();
      return;
    }

    loadRequest();
  }, [requestId, familyId]);

  // Load caller name
  useEffect(() => {
    if (request?.triggeredByUid && familyId) {
      getMemberDisplayName(familyId, request.triggeredByUid)
        .then(setCallerName)
        .catch(() => setCallerName('Un padre/tutor'));
    }
  }, [request?.triggeredByUid, familyId]);

  // Countdown and sound
  useEffect(() => {
    if (!request) return;

    const updateCountdown = () => {
      const now = Date.now();
      const expiresAt = request.expiresAt.toMillis();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

      if (remaining === 0) {
        setExpired(true);
        stopSound();
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      } else {
        setCountdown(remaining);
      }
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    // Play sound if loud and allowed
    // Note: We assume loud is allowed if intensity is 'loud' (backend already validated)
    if (request.intensity === 'loud') {
      playSound(request.durationSec);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      stopSound();
    };
  }, [request]);

  const loadRequest = async () => {
    if (!requestId || !familyId) return;

    setLoadingRequest(true);
    try {
      const loadedRequest = await getAttentionRequest(familyId, requestId);
      
      if (!loadedRequest) {
        Alert.alert('Error', 'Solicitud no encontrada');
        router.back();
        return;
      }

      // Check if expired
      const now = Date.now();
      const expiresAt = loadedRequest.expiresAt.toMillis();
      if (expiresAt < now && loadedRequest.status === 'active') {
        setExpired(true);
      }

      setRequest(loadedRequest);
    } catch (error: any) {
      showError(error.message || 'Error al cargar la solicitud');
      router.back();
    } finally {
      setLoadingRequest(false);
    }
  };

  const playSound = async (durationSec: number) => {
    try {
      // Use system default notification sound as fallback
      // In production, you can add a custom sound file to assets/sounds/
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'default' },
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;

      // Stop after durationSec
      setTimeout(() => {
        stopSound();
      }, durationSec * 1000);
    } catch (error) {
      console.error('Error playing sound:', error);
      // If sound fails, continue without sound (non-blocking)
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
      soundRef.current = null;
    }
  };

  const handleAck = async () => {
    if (!requestId || !familyId) return;

    try {
      stopSound();
      await ack(familyId, requestId);
      router.back();
    } catch (error: any) {
      showError(error.message || 'Error al reconocer la solicitud');
    }
  };

  if (loadingRequest) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Solicitud no encontrada</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔔</Text>
        <Text style={styles.title}>Solicitud de Atención</Text>
        
        <Text style={styles.callerText}>
          Te está llamando: {callerName}
        </Text>

        {request.message && (
          <Text style={styles.message}>{request.message}</Text>
        )}

        {expired ? (
          <Text style={styles.expiredText}>Expiró</Text>
        ) : (
          <Text style={styles.countdown}>{formatCountdown(countdown)}</Text>
        )}

        <TouchableOpacity
          style={[styles.ackButton, (loading || expired) && styles.ackButtonDisabled]}
          onPress={handleAck}
          disabled={loading || expired}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.ackButtonText}>Entendido</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  callerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  countdown: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#007AFF',
  },
  expiredText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#FF3B30',
  },
  ackButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  ackButtonDisabled: {
    backgroundColor: '#ccc',
  },
  ackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

