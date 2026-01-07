import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

type ChildrenProps = ViewProps & { children?: React.ReactNode };

export function Card({ style, children, ...rest }: ChildrenProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardHeader({ style, children, ...rest }: ChildrenProps) {
  return (
    <View style={[styles.header, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardFooter({ style, children, ...rest }: ChildrenProps) {
  return (
    <View style={[styles.footer, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardTitle({ style, children, ...rest }: ChildrenProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

export function CardAction({ style, children, ...rest }: ChildrenProps) {
  return (
    <View style={[styles.action, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardDescription({ style, children, ...rest }: ChildrenProps) {
  return (
    <Text style={[styles.description, style]} {...rest}>
      {children}
    </Text>
  );
}

export function CardContent({ style, children, ...rest }: ChildrenProps) {
  return (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    gap: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  action: {
    alignSelf: "flex-end",
  },
  description: {
    color: "#6B7280",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

