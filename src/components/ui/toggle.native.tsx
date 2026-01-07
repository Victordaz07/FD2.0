import React from "react";
import { View, Text } from "react-native";

export function Toggle(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Toggle (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export const toggleVariants = {};
