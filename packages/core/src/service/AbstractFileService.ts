import Fs from 'fs-extra';
import Util from '../util/index.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { ServiceType } from '../type/service.js';
import AbstractService from './AbstractService.js';
import LogService from './LogService.js';

/**
 * A base service for all file services that provides methods to handle them in a unified way
 */
export default abstract class AbstractFileService extends AbstractService {
  private logService: LogService;

  /**
   * Do not instantiate directly as this is an abstract class
   */
  protected constructor(
    type: ServiceType,
    options: ElekIoCoreOptions,
    logService: LogService
  ) {
    super(type, options);

    this.logService = logService;
  }

  /**
   * Creates a new file on disk. Fails if path already exists
   *
   * @param data Data to write into the file
   * @param path Path to write the file to
   */
  protected async create(data: any, path: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    await Fs.writeFile(path, data, {
      flag: 'wx',
      encoding: 'utf8',
    });
    this.logService.debug('Created file', { data, path }, projectId);
  }

  /**
   * Reads the content of a file on disk. Fails if path does not exist
   *
   * @param path Path to read the file from
   */
  protected async read(path: string): Promise<any> {
    const projectId = Util.fromPath.projectId(path);
    const data = await Fs.readFile(path, {
      flag: 'r',
      encoding: 'utf8',
    });
    this.logService.debug('Read file', { data, path }, projectId);
    return data;
  }

  /**
   * Overwrites an existing file on disk
   *
   * @todo Check how to error out if the file does not exist already
   *
   * @param data Data to write into the file
   * @param path Path to the file to overwrite
   */
  protected async update(data: any, path: string): Promise<void> {
    const projectId = Util.fromPath.projectId(path);
    await Fs.writeFile(path, data, {
      flag: 'w',
      encoding: 'utf8',
    });
    this.logService.debug('Updated file', { data, path }, projectId);
  }
}
