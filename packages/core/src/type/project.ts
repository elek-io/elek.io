import Project from '../model/Project.js';
import { Locale } from './general.js';

export type ProjectStatus = 'todo' | 'foo' | 'bar';

export interface ProjectSettings {
  locale: {
    default: Locale;
    supported: Locale[];
  };
}

export enum ProjectFolder {
  ASSETS = 'assets',
  COLLECTIONS = 'collections',
  FIELDS = 'fields',
  LFS = 'lfs',
  LOGS = 'logs',
  PUBLIC = 'public',
  THEME = 'theme',
}

export interface ProjectUpgrade {
  /**
   * The core version the Project will be upgraded to
   */
  readonly coreVersion: string;
  /**
   * Function that will be executed in the process of upgrading a Project
   */
  run: (project: Project) => Promise<void>;
}

export type ProjectUpgradeImport = typeof import('../upgrade/example.js');
