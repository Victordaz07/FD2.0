import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(
  ({ label, error, helperText, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            props.editable === false && styles.inputDisabled,
            style,
          ]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {helperText && !error && (
          <Text style={styles.helperText}>{helperText}</Text>
        )}
      </View>
    );
  }
);

FormField.displayName = "FormField";

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#FCA5A5",
    borderWidth: 1,
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
