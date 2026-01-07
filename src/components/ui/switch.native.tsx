import React from "react";
import { View, Switch as RNSwitch, StyleSheet } from "react-native";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: SwitchProps) {
  return (
    <View style={styles.container}>
      <RNSwitch
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={{ false: "#E5E7EB", true: "#4F46E5" }}
        thumbColor={checked ? "#FFFFFF" : "#F3F4F6"}
        ios_backgroundColor="#E5E7EB"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});
