// Platform resolution fallback
// TypeScript will resolve this to .web or .native based on platform at build time
// For type checking, we export from .web since that has proper types
export * from './utils.native';

