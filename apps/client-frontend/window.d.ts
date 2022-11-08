// This file should augment the properties of the `Window` with the type of the
// `ContextBridgeApi` from `Electron.contextBridge` declared in `./preload.ts`.
import type { ContextBridgeApi } from '../client/src/renderer/preload';

declare global {
  interface Window {
    ipc: ContextBridgeApi;
  }
}
