# Development Rules

## Runtime Environment

- **This project MUST be run using Expo Dev Client.**
- Use `expo start --dev-client` for development.
- **Expo Go on Android causes misleading runtime crashes.**
- Expo Go is for demos only, not for development of medium/large apps.

## Boolean Handling

- **`Boolean(x)` is FORBIDDEN for external data** (Firestore, env, params, storage).
- `Boolean("false") === true` causes silent bugs.
- **Use `toBool()` exclusively** for all external boolean normalization.
- `toBool()` is defined in `src/lib/helpers/booleanHelpers.ts`.

## Debugging Philosophy

- **DO NOT attempt to "patch" Android Expo Go crashes.**
- If a crash appears only in Expo Go Android, it's a false positive of the environment, not a code bug.
- **Before proposing structural changes, assume the environment is stable (Dev Client).**
- Priority: advance functionality, don't chase debug environment errors.

## Confirmed Behavior

- The app starts correctly in Dev Client.
- Crashes in Expo Go Android are environment issues, not code bugs.

## Code Quality

- Any solution proposed must respect these rules.
- Do not add defensive `Boolean()` wrappers "just in case".
- Trust `toBool()` for external data normalization.

