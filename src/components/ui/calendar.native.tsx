import React from "react";
import { View, Text } from "react-native";

export function Calendar(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Calendar (Native stub)</Text>
      {props?.children}
    </View>
  );
}
