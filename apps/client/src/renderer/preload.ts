// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

/**
 * @todo Ideally we could import and use the core types here
 */
export interface ContextBridgeApi {
  core: {
    projects: {
      count: () => Promise<number>;
    };
  };
}

const exposedApi: ContextBridgeApi = {
  core: {
    projects: {
      count: () => ipcRenderer.invoke('core:projects:count'),
    },
  },
};

contextBridge.exposeInMainWorld('ipc', exposedApi);
