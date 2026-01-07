import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type InputProps = TextInputProps;

export function Input({ style, ...rest }: InputProps) {
  return (
    <TextInput
      style={StyleSheet.flatten([styles.input, style])}
      placeholderTextColor="#9CA3AF"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
});

