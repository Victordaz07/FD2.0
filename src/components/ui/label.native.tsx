import React from "react";
import { View, Text } from "react-native";

export function Label(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Label (Native stub)</Text>
      {props?.children}
    </View>
  );
}
