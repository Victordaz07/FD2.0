import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, ViewProps } from "react-native";
import { theme } from "@/theme/theme";

type Props = ViewProps & {
  scroll?: boolean;
};

export function FDScreen({ scroll = false, style, children, ...props }: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.layout.screenPaddingX,
            paddingTop: theme.layout.screenPaddingTop,
            paddingBottom: theme.layout.screenPaddingBottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View {...props} style={style}>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        {...props}
        style={[
          {
            flex: 1,
            paddingHorizontal: theme.layout.screenPaddingX,
            paddingTop: theme.layout.screenPaddingTop,
            paddingBottom: theme.layout.screenPaddingBottom,
          },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

