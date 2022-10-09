import Os from 'os';
import Fs from 'fs-extra';
import Path from 'path';
import { v4 as Uuid } from 'uuid';
import Slugify from 'slugify';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import groupBy from 'lodash/groupBy.js';
import uniq from 'lodash/uniq.js';
import flatten from 'lodash/flatten.js';
import filter from 'lodash/filter.js';
import * as Validator from './validator.js';

/**
 * The directory in which everything is stored and will be worked in
 */
export const workingDirectory = Path.join(Os.homedir(), 'elek.io');

/**
 * A collection of often used paths
 */
export const pathTo = {
  tmp: Path.join(workingDirectory, 'tmp'),
  logs: Path.join(workingDirectory, 'logs'),

  projects: Path.join(workingDirectory, 'projects'),
  project: (projectId: string): string => {
    return Path.join(pathTo.projects, projectId);
  },
  projectConfig: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'project.json');
  },
  projectLogs: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'logs');
  },

  public: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'public');
  },

  lfs: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'lfs');
  },

  collections: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'collections');
  },
  collection: (projectId: string, collectionId: string) => {
    return Path.join(pathTo.collections(projectId), collectionId);
  },
  collectionConfig: (projectId: string, collectionId: string) => {
    return Path.join(
      pathTo.collection(projectId, collectionId),
      'collection.json'
    );
  },

  collectionItems: (projectId: string, collectionId: string): string => {
    return Path.join(pathTo.collection(projectId, collectionId));
  },
  collectionItemConfig: (
    projectId: string,
    collectionId: string,
    collectionItemId: string,
    language: string
  ) => {
    return Path.join(
      pathTo.collectionItems(projectId, collectionId),
      `${collectionItemId}.${language}.json`
    );
  },

  fields: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'fields');
  },
  fieldConfig: (projectId: string, fieldId: string, language: string) => {
    return Path.join(pathTo.fields(projectId), `${fieldId}.${language}.json`);
  },

  theme: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'theme');
  },
  themeConfig: (projectId: string): string => {
    const defaultPath = Path.join(pathTo.theme(projectId), 'theme.json');
    const alternativePath = Path.join(pathTo.theme(projectId), 'package.json');

    if (Fs.existsSync(defaultPath)) {
      return defaultPath;
    }

    return alternativePath;
  },

  assets: (projectId: string): string => {
    return Path.join(pathTo.project(projectId), 'assets');
  },
  assetConfig: (
    projectId: string,
    assetId: string,
    language: string
  ): string => {
    return Path.join(pathTo.assets(projectId), `${assetId}.${language}.json`);
  },
  assetFile: (
    projectId: string,
    assetId: string,
    language: string,
    extension: string
  ): string => {
    return Path.join(
      pathTo.lfs(projectId),
      `${assetId}.${language}.${extension}`
    );
  },
};

/**
 * Searches for a potential project ID in given path string and returns it
 *
 * Mainly used for logging inside the GitService, where we don't have a project ID,
 * but always have a path which could contain one. The ID is then used,
 * to log to the current project log, instead of logging to the main log file.
 *
 * @todo I really dont like this and I do not know how much performance we loose here
 */
export const fromPath = {
  projectId: (path: string): string | undefined => {
    const startsWith = 'projects/';
    const endsWith = '/';
    const start = path.indexOf(startsWith) + startsWith.length;
    // Return early
    if (start === -1) {
      return undefined;
    }
    const end = path.indexOf(endsWith, start);
    // Use path length if there is no ending "/"
    const result = path.substring(start, end === -1 ? path.length : end);
    if (result && Validator.isUuid(result)) {
      return result;
    }
    return undefined;
  },
};

/**
 * Returns a new UUID
 */
export function uuid(): string {
  return Uuid();
}

/**
 * Returns a complete default type, hydrated with the partials of value
 */
export function assignDefaultIfMissing<T extends {}>(
  value: Partial<T> | undefined | null,
  defaultsTo: T
): T {
  return Object.assign(defaultsTo, value);
}

/**
 * Used as parameter for filter() methods to assure,
 * only values not null, undefined or empty strings are returned
 *
 * @param value Value to check
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return false;
    }
  }
  return true;
}

/**
 * Returns the slug of given string
 */
export function slug(string: string): string {
  return Slugify(string, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
  });
}

export function isNoError<T>(item: T | Error): item is T {
  return item instanceof Error !== true;
}

/**
 * Basically a Promise.all() without rejecting if one promise fails to resolve
 */
export async function returnResolved<T>(promises: Promise<T>[]) {
  const toCheck: Promise<T | Error>[] = [];
  for (let index = 0; index < promises.length; index++) {
    const promise = promises[index];
    if (!promise) {
      throw new Error(`No promise found at index "${index}"`);
    }
    // Here comes the trick:
    // By using "then" and "catch" we are able to create an array of Project and Error types
    // without throwing and stopping the later Promise.all() call prematurely
    toCheck.push(
      promise
        .then((result) => {
          return result;
        })
        .catch((error) => {
          // Because the error parameter could be anything,
          // we need to specifically call an Error
          return new Error(error);
        })
    );
  }
  // Resolve all promises
  // Here we do not expect any error to fail the call to Promise.all()
  // because we caught it earlier and returning an Error type instead of throwing it
  const checked = await Promise.all(toCheck);
  // This way we can easily filter out any Errors by type
  // Note that we also need to use a User-Defined Type Guard here,
  // because otherwise TS does not recognize we are filtering the errors out
  //                         >       |        <
  return checked.filter(isNoError);
}

/**
 * Custom async typescript ready implementation of Node.js child_process
 *
 * @see https://nodejs.org/api/child_process.html
 * @see https://github.com/ralphtheninja/await-spawn
 */
export function spawnChildProcess(
  command: string,
  args: ReadonlyArray<string>,
  options?: SpawnOptionsWithoutStdio
): Promise<string> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, options);
    let log = '';

    childProcess.stdout.on('data', (data) => {
      log += data;
    });

    childProcess.stderr.on('data', (data) => {
      log += data;
    });

    childProcess.on('error', (error) => {
      throw error;
    });

    childProcess.on('exit', (code) => {
      if (code === 0) {
        return resolve(log);
      }
      return reject(log);
    });
  });
}

/**
 * Returns all subdirectories of given directory
 */
export async function subdirectories(path: string): Promise<Fs.Dirent[]> {
  const dirent = await Fs.promises.readdir(path, { withFileTypes: true });
  return dirent.filter((dirent) => {
    return dirent.isDirectory();
  });
}

/**
 * Returns all files of given directory which can be filtered by extension
 */
export async function files(
  path: string,
  extension?: string
): Promise<Fs.Dirent[]> {
  const dirent = await Fs.promises.readdir(path, { withFileTypes: true });
  return dirent.filter((dirent) => {
    if (extension && dirent.isFile() === true) {
      if (dirent.name.endsWith(extension)) {
        return true;
      }
      return false;
    }
    return dirent.isFile();
  });
}

/**
 * Returns the relative path for given path
 * by stripping out everything up to the working directory
 */
export function getRelativePath(path: string): string {
  let relativePath = path.replace(workingDirectory, '');
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substr(1);
  }
  return relativePath;
}

/**
 * Searches given array of objects for duplicates of given key and returns them
 *
 * @param arr Array with possible duplicate values
 * @param key Key of object T to get duplicates of
 */
export function getDuplicates<T>(arr: T[], key: keyof T) {
  const grouped = groupBy(arr, (item) => {
    return item[key];
  });
  return uniq(
    flatten(
      filter(grouped, (item) => {
        return item.length > 1;
      })
    )
  );
}
