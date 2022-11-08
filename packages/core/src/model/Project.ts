import { CreatedUpdatedMeta } from '../type/model.js';
import ProjectConfig from './ProjectConfig.js';

export default class Project
  extends ProjectConfig
  implements CreatedUpdatedMeta
{
  public readonly created: number;
  public readonly updated: number;

  constructor(projectConfig: ProjectConfig, created: number, updated: number) {
    super(
      projectConfig.id,
      projectConfig.name,
      projectConfig.description,
      projectConfig.settings
    );

    this.created = created;
    this.updated = updated;
  }
}
