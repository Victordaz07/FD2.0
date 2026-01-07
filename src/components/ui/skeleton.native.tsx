import React from "react";
import { View, Text } from "react-native";

export function Skeleton(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Skeleton (Native stub)</Text>
      {props?.children}
    </View>
  );
}
