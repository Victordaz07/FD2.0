import React from "react";
import { View, Text } from "react-native";

export function Carousel(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>Carousel (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CarouselContent(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CarouselContent (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CarouselItem(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CarouselItem (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CarouselPrevious(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CarouselPrevious (Native stub)</Text>
      {props?.children}
    </View>
  );
}

export function CarouselNext(props: any) {
  return (
    <View style={{ padding: 8 }}>
      <Text>CarouselNext (Native stub)</Text>
      {props?.children}
    </View>
  );
}
