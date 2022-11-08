import { ModelType } from '../type/model.js';
import { ProjectSettings, ProjectStatus } from '../type/project.js';
import AbstractModel from './AbstractModel.js';

/**
 * The Project represents a Projects configuration file on disk
 */
export default class ProjectConfig extends AbstractModel {
  /**
   * elek.io core version which this Project was last upgraded to
   *
   * If the client version is below this, it needs to be upgraded.
   * If the client version is above this, the Project needs to be upgraded.
   */
  public coreVersion = '0.0.15';
  public name: string;
  public description: string;
  // public url: string;
  // public color: string;

  /**
   * The version is handled automatically
   *
   * Every time before a Project is published, all commits will be iterated,
   * the version will be incremented accordingly and a new snapshot is created.
   *
   * @todo implement this behavior
   *
   * - `MAJOR` is incremented when the client was updated or the theme was changed or updated
   * - `MINOR` is incremented when new content is added or existing deleted
   * - `PATCH` is incremented when existing content is updated
   */
  public version = '0.1.0';
  public status: ProjectStatus = 'todo';
  public settings: ProjectSettings;

  constructor(
    id: string,
    name: string,
    description: string,
    settings: ProjectSettings
  ) {
    super(id, ModelType.PROJECT);

    this.name = name;
    this.description = description;
    this.settings = settings;
  }
}
