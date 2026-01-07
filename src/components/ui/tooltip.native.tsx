import React from "react";
import { View, Text } from "react-native";

export function Tooltip(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Tooltip (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function TooltipTrigger(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>TooltipTrigger (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function TooltipContent(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>TooltipContent (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function TooltipProvider(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>TooltipProvider (Native stub)</Text>
      {props?.children}
    </View>
  );
}
