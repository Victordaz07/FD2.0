import React from "react";
import { View, Text } from "react-native";

export function Alert(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Alert (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function AlertTitle(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>AlertTitle (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function AlertDescription(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>AlertDescription (Native stub)</Text>
      {props?.children}
    </View>
  );
}
