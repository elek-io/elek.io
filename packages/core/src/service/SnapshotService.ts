import { CoreEventName } from '../type/coreEvent.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { GitCommit, GitLogOptions } from '../type/git.js';
import { ModelType } from '../type/model.js';
import {
  ExtendedCrudService,
  PaginatedList,
  ServiceType,
  Sort,
} from '../type/service.js';
import MethodNotSupportedError from '../error/MethodNotSupportedError.js';
import AbstractModel from '../model/AbstractModel.js';
import ProjectConfig from '../model/ProjectConfig.js';
import Snapshot from '../model/Snapshot.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import EventService from './EventService.js';
import GitService from './GitService.js';

/**
 * Service that manages CRUD functionality for snapshots
 */
export default class SnapshotService
  extends AbstractService
  implements ExtendedCrudService<Snapshot>
{
  private eventService: EventService;
  private gitService: GitService;

  constructor(
    options: ElekIoCoreOptions,
    eventService: EventService,
    gitService: GitService
  ) {
    super(ServiceType.SNAPSHOT, options);

    this.eventService = eventService;
    this.gitService = gitService;
  }

  /**
   * Creates a new snapshot of given project
   *
   * @param project Project to create the snapshot from
   * @param name Name of the new snapshot
   */
  public async create(
    projectId: string,
    name: string,
    commit?: GitCommit
  ): Promise<Snapshot> {
    const id = Util.uuid();
    const projectPath = Util.pathTo.project(projectId);
    const tag = await this.gitService.createTag(projectPath, id, name, commit);
    const snapshot = new Snapshot(
      tag.name,
      tag.message,
      tag.timestamp,
      tag.author
    );
    return snapshot;
  }

  /**
   * Finds and returns a snapshot by ID
   *
   * @param project Project of the snapshot to read
   * @param id ID of the snapshot to read
   */
  public async read(projectId: string, id: string): Promise<Snapshot> {
    const tags = await this.gitService.listTags(
      Util.pathTo.project(projectId),
      id
    );
    if (tags.length === 0 || !tags[0]) {
      throw new Error(`Snapshot "${id}" not found`);
    }
    if (tags.length > 1) {
      throw new Error(`Snapshot "${id}" resolved ${tags.length} git tags`);
    }
    const snapshot = new Snapshot(
      tags[0].name,
      tags[0].message,
      tags[0].timestamp,
      tags[0].author
    );
    return snapshot;
  }

  /**
   * @todo Check if we are able to and actually want to update snapshots
   */
  public async update(): Promise<void> {
    throw new MethodNotSupportedError();
  }

  public async list(
    projectId: string,
    sort: Sort<Snapshot>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<Snapshot>> {
    const tags = await this.gitService.listTags(Util.pathTo.project(projectId));
    const list: Snapshot[] = [];
    tags.forEach((tag) => {
      list.push(new Snapshot(tag.name, tag.message, tag.timestamp, tag.author));
    });

    return this.paginate(list, sort, filter, limit, offset);
  }

  public async count(projectId: string): Promise<number> {
    return (await this.list(projectId, undefined, undefined, 0, 0)).total;
  }

  public async log(
    projectId: string,
    options?: GitLogOptions
  ): Promise<GitCommit[]> {
    return this.gitService.log(Util.pathTo.project(projectId), options);
  }

  /**
   * Reverts the projects state back to given snapshot
   *
   * @todo Since the LFS folder is ignored by git
   * (which is correct since we only want asset references, not the actual files inside git),
   * we need to find a way to restore the LFS folder to the given state of the snapshot too.
   * Until then, assets are broken once we revert to a snapshot
   *
   * @param project Project to revert
   * @param snapshot Snapshot of the project to revert to
   * @param message Optional overwrite for the git message
   */
  public async revert(
    projectId: string,
    snapshot: Snapshot,
    message = `Reverted project state to ${this.type}`
  ): Promise<void> {
    const projectPath = Util.pathTo.project(projectId);
    // Restore the working directory files to given snapshot / Git tag
    await this.gitService.restore(projectPath, snapshot.id, ['.']);
    // Commit the now changed files again
    await this.gitService.add(projectPath, ['.']);
    await this.gitService.commit(
      projectPath,
      `:rewind: ${message} (ID: ${snapshot.id})`
    );
  }

  /**
   * Deletes given snapshot
   *
   * @param project Project of the snapshot to delete
   * @param snapshot Snapshot to delete
   */
  public async delete(projectId: string, snapshot: Snapshot): Promise<void> {
    await this.gitService.deleteTag(
      Util.pathTo.project(projectId),
      snapshot.id
    );
  }

  /**
   * Checks if given AbstractModel is of type Snapshot
   *
   * @param model The AbstractModel to check
   */
  public isSnapshot(model: AbstractModel): model is Snapshot {
    return model.modelType === ModelType.SNAPSHOT;
  }
}
