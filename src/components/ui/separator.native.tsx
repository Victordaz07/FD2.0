import React from "react";
import { View, Text } from "react-native";

export function Separator(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Separator (Native stub)</Text>
      {props?.children}
    </View>
  );
}
