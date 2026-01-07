import React from "react";
import { View, Text } from "react-native";

export function Collapsible(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Collapsible (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CollapsibleTrigger(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CollapsibleTrigger (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CollapsibleContent(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CollapsibleContent (Native stub)</Text>
      {props?.children}
    </View>
  );
}
