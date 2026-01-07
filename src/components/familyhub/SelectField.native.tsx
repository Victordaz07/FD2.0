import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectFieldProps {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  placeholder?: string;
}

export const SelectField = forwardRef<any, SelectFieldProps>(
  (
    {
      label,
      value,
      onValueChange,
      error,
      helperText,
      disabled = false,
      children,
      placeholder = "Seleccionar...",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");

    // Extraer opciones de children (option elements)
    const options: { value: string; label: string }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type as any) === "option") {
        const props = child.props as { value?: string; children?: React.ReactNode };
        options.push({
          value: props.value || "",
          label: (typeof props.children === "string" ? props.children : props.value) || "",
        });
      }
    });

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onValueChange?.(optionValue);
      setIsOpen(false);
    };

    const selectedLabel =
      options.find((opt) => opt.value === selectedValue)?.label || placeholder;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <Pressable
          onPress={() => !disabled && setIsOpen(true)}
          style={[
            styles.select,
            error && styles.selectError,
            disabled && styles.selectDisabled,
          ]}
        >
          <Text
            style={[
              styles.selectText,
              !selectedValue && styles.placeholderText,
            ]}
          >
            {selectedLabel}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
        </Pressable>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {helperText && !error && (
          <Text style={styles.helperText}>{helperText}</Text>
        )}

        <Modal
          visible={isOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <Pressable onPress={() => setIsOpen(false)}>
                  <Ionicons name="close" size={24} color="#111827" />
                </Pressable>
              </View>
              <ScrollView>
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.option,
                      selectedValue === option.value && styles.optionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedValue === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedValue === option.value && (
                      <Ionicons name="checkmark" size={20} color="#4F46E5" />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }
);

SelectField.displayName = "SelectField";

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
  select: {
    width: "100%",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectError: {
    borderColor: "#FCA5A5",
  },
  selectDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.6,
  },
  selectText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholderText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionSelected: {
    backgroundColor: "#EEF2FF",
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  optionTextSelected: {
    color: "#4F46E5",
    fontWeight: "500",
  },
});
