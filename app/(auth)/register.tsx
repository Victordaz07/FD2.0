import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { signUp } from "@/lib/auth/authService";
import { useAuthStore } from "@/store/authStore";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async () => {
    console.log("[Register] handleRegister called", {
      email,
      hasPassword: !!password,
      displayName,
    });

    if (!email || !password) {
      Alert.alert("Error", "Email y contraseña son requeridos");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      console.log("[Register] Attempting sign up...");
      const user = await signUp(email, password, displayName || undefined);
      console.log("[Register] Sign up successful", {
        uid: user.uid,
        email: user.email,
      });

      setUser(user);
      console.log("[Register] User set in store, navigating...");

      // Navigation will be handled by index.tsx - user needs to create/join family
      router.replace("/(onboarding)/create-family");
    } catch (error: any) {
      console.error("[Register] Sign up error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Error desconocido";
      let shouldRedirectToLogin = false;

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "Este email ya está registrado. ¿Quieres iniciar sesión en su lugar?";
        shouldRedirectToLogin = true;
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El email no es válido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres)";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        "Error de registro",
        errorMessage,
        shouldRedirectToLogin
          ? [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Ir a Login",
                onPress: () => router.push("/(auth)/login"),
              },
            ]
          : [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>FamilyDash</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre (opcional)"
        value={displayName}
        onChangeText={setDisplayName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => {
          console.log("[Register] Button pressed");
          handleRegister();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear cuenta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        disabled={loading}
      >
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    color: "#007AFF",
    fontSize: 14,
  },
});
