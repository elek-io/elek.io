// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import ElekIoCore from 'core';
import ProjectService from 'core/dist/esm/service/ProjectService';
import { contextBridge, ipcRenderer } from 'electron';

export interface ContextBridgeApi {
  core: {
    projects: {
      count: ProjectService['count'];
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
