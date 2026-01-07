// This file should not be needed - Metro/Expo Router should automatically resolve
// to index.web.tsx (web) or index.native.tsx (native) based on platform
// However, Expo Router requires a base file for route resolution
// Re-export from native as fallback (Metro will override with .web.tsx on web)
export { default } from "./index.native";

