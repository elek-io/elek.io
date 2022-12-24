// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import Asset from 'core/dist/esm/model/Asset';
import Project from 'core/dist/esm/model/Project';
import ProjectService from 'core/dist/esm/service/ProjectService';
import { PaginatedList } from 'core/dist/esm/type/service';
import { contextBridge, ipcRenderer } from 'electron';

type IpcRendererHandler<T> = (...args: [T]) => void;

async function handleIpcRenderer<T>(channel: string, ...args: T[]) {
  return ipcRenderer.invoke(channel, args);
}

/**
 * @todo Ideally we could import and use the core types here
 */
export interface ContextBridgeApi {
  core: {
    projects: {
      count: () => Promise<number>;
      list: () => Promise<PaginatedList<Project>>;
      read: (id: string) => Promise<Project>;
    };
    assets: {
      list: (projectId: string) => Promise<PaginatedList<Asset>>;
    };
  };
}

const exposedApi: ContextBridgeApi = {
  core: {
    projects: {
      count: () => ipcRenderer.invoke('core:projects:count'),
      list: () => ipcRenderer.invoke('core:projects:list'),
      read: (...args: any[]) => ipcRenderer.invoke('core:projects:read', args),
    },
    assets: {
      list: (projectId) =>
        ipcRenderer.invoke('core:assets:list', { projectId }),
    },
  },
};

contextBridge.exposeInMainWorld('ipc', exposedApi);
