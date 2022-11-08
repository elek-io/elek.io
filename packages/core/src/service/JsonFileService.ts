import { ElekIoCoreOptions, JsonOf } from '../type/general.js';
import { ServiceType } from '../type/service.js';
import AbstractFileService from './AbstractFileService.js';
import LogService from './LogService.js';

/**
 * Service that manages CRUD functionality for JSON files on disk
 */
export default class JsonFileService extends AbstractFileService {
  constructor(options: ElekIoCoreOptions, logService: LogService) {
    super(ServiceType.JSON_FILE, options, logService);
  }

  public async create<T>(data: T, path: string): Promise<void> {
    await super.create(this.serialize<T>(data), path);
  }

  public async read<T>(path: string): Promise<JsonOf<T>> {
    return this.deserialize<T>(await super.read(path));
  }

  public async update<T>(data: T, path: string): Promise<void> {
    await super.update(this.serialize<T>(data), path);
  }

  private serialize<T>(data: T): string {
    return JSON.stringify(data, null, this.options.file.json.indentation);
  }

  private deserialize<T>(data: string): JsonOf<T> {
    return JSON.parse(data);
  }
}
