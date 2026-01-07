import React from "react";
import { View, Text } from "react-native";

export function HoverCard(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>HoverCard (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function HoverCardTrigger(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>HoverCardTrigger (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function HoverCardContent(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>HoverCardContent (Native stub)</Text>
      {props?.children}
    </View>
  );
}
