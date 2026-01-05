import React from "react";
import { Switch, SwitchProps } from "react-native";

type Props = Omit<SwitchProps, "value" | "disabled"> & { 
  value?: any;
  disabled?: any;
};

const toBool = (v: any, fallback = false): boolean => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    if (s === "1") return true;
    if (s === "0") return false;
  }
  if (typeof v === "number") return v === 1 ? true : v === 0 ? false : fallback;
  return fallback;
};

export function SafeSwitch({ value, disabled, ...rest }: Props) {
  return (
    <Switch 
      value={toBool(value)} 
      disabled={disabled !== undefined ? toBool(disabled) : false}
      {...rest} 
    />
  );
}


