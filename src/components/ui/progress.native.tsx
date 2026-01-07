import React from "react";
import { View, Text } from "react-native";

export function Progress(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Progress (Native stub)</Text>
      {props?.children}
    </View>
  );
}
