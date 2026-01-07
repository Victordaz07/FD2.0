import React from "react";
import { View, Text } from "react-native";

export function ScrollArea(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>ScrollArea (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function ScrollBar(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>ScrollBar (Native stub)</Text>
      {props?.children}
    </View>
  );
}
