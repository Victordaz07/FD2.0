import React from "react";
import { View, Text } from "react-native";

export function Avatar(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Avatar (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function AvatarImage(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>AvatarImage (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function AvatarFallback(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>AvatarFallback (Native stub)</Text>
      {props?.children}
    </View>
  );
}
