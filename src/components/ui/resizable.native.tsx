import React from "react";
import { View, Text } from "react-native";

export function ResizablePanelGroup(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>ResizablePanelGroup (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function ResizablePanel(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>ResizablePanel (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function ResizableHandle(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>ResizableHandle (Native stub)</Text>
      {props?.children}
    </View>
  );
}
