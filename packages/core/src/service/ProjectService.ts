import Os from 'os';
import Path from 'path';
import Fs from 'fs-extra';
import Semver from 'semver';
import AbstractModel from '../model/AbstractModel.js';
import ProjectConfig from '../model/ProjectConfig.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import JsonFileService from './JsonFileService.js';
import { ElekIoCoreOptions } from '../type/general.js';
import GitService from './GitService.js';
import ThemeService from './ThemeService.js';
import {
  ExtendedCrudService,
  PaginatedList,
  ServiceType,
  Sort,
} from '../type/service.js';
import { ModelType } from '../type/model.js';
import SearchService from './SearchService.js';
import { ProjectFolder, ProjectSettings } from '../type/project.js';
import { GitCommitIcon } from '../type/git.js';
import LogService from './LogService.js';
import Project from '../model/Project.js';
import AssetService from './AssetService.js';
import CollectionService from './CollectionService.js';
import { version as currentCoreVersion } from '../../package.json';
import SnapshotService from './SnapshotService.js';
import { ProjectUpgradeImport } from '../type/project.js';
import ProjectUpgradeError from '../error/ProjectUpgradeError.js';

/**
 * Service that manages CRUD functionality for Project files on disk
 */
export default class ProjectService
  extends AbstractService
  implements ExtendedCrudService<ProjectConfig>
{
  private logService: LogService;
  private jsonFileService: JsonFileService;
  private gitService: GitService;
  private themeService: ThemeService;
  private searchService: SearchService;
  private assetService: AssetService;
  private collectionService: CollectionService;
  private snapshotService: SnapshotService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService,
    themeService: ThemeService,
    searchService: SearchService,
    assetService: AssetService,
    collectionService: CollectionService,
    snapshotService: SnapshotService
  ) {
    super(ServiceType.PROJECT, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
    this.themeService = themeService;
    this.searchService = searchService;
    this.assetService = assetService;
    this.collectionService = collectionService;
    this.snapshotService = snapshotService;
  }

  /**
   * Creates a new Project
   *
   * @param name        Name of the Project
   * @param description Description of the Project
   * @param settings    (Optional) Project settings
   */
  public async create(
    name: string,
    description: string,
    settings?: ProjectSettings
  ): Promise<Project> {
    this.logService.debug('Recieved request to create Project', {
      name,
      description,
      settings,
    });

    const defaultSettings: ProjectSettings = {
      locale: {
        default: this.options.locale,
        supported: [this.options.locale],
      },
    };

    const projectConfig = new ProjectConfig(
      Util.uuid(),
      name,
      description,
      Object.assign({}, defaultSettings, settings)
    );

    this.logService.debug('Created ProjectConfig', { projectConfig });

    const projectPath = Util.pathTo.project(projectConfig.id);

    await Fs.ensureDir(projectPath);
    await this.createFolderStructure(projectPath);
    await this.createGitignore(projectPath);
    await this.gitService.init(projectPath, { initialBranch: 'main' });
    await this.jsonFileService.create(
      projectConfig,
      Util.pathTo.projectConfig(projectConfig.id)
    );
    await this.gitService.add(projectPath, ['.']);
    await this.gitService.commit(
      projectPath,
      `${GitCommitIcon.INIT} Created this new elek.io project`
    );
    await this.gitService.switch(projectPath, 'stage', { isNew: true });

    const project = await this.toProject(projectConfig);

    this.logService.info('Created Project', { project }, project.id);

    return project;
  }

  /**
   * Returns a Project by ID
   *
   * @param id ID of the Project to read
   */
  public async read(id: string): Promise<Project> {
    this.logService.debug('Recieved request to read Project', { id }, id);

    const json = await this.jsonFileService.read<ProjectConfig>(
      Util.pathTo.projectConfig(id)
    );

    this.logService.debug('Read ProjectConfig from disk', { json }, id);

    const projectConfig = new ProjectConfig(
      json.id,
      json.name,
      json.description,
      json.settings
    );

    this.logService.debug('Created ProjectConfig', { projectConfig }, id);

    return this.toProject(projectConfig);
  }

  /**
   * Updates given Project
   *
   * @param project Project to update
   */
  public async update(project: Project): Promise<void> {
    this.logService.debug(
      'Recieved request to update Project',
      { project },
      project.id
    );

    const projectPath = Util.pathTo.project(project.id);
    const configPath = Util.pathTo.projectConfig(project.id);
    await this.jsonFileService.update(project, configPath);
    await this.gitService.add(projectPath, [configPath]);
    await this.gitService.commit(projectPath, this.gitMessage.update);

    this.logService.info('Updated Project', { project }, project.id);
  }

  /**
   * Upgrades given Project to the latest version of this client
   *
   * Needed when a new core version is requiring changes to existing files or structure.
   *
   * @todo Find out why using this.snapshotService is throwing isObjWithKeyAndValueOfString of undefined error in gitService (maybe binding issue)
   */
  public async upgrade(projectId: string): Promise<void> {
    this.logService.debug(
      'Recieved request to upgrade Project',
      { projectId },
      projectId
    );

    const project = await this.read(projectId);

    if (Semver.gt(project.coreVersion, currentCoreVersion)) {
      // Upgrade of the client needed before the project can be upgraded
      const message = `Failed upgrading project. The projects core version "${project.coreVersion}" is higher than the current core version "${currentCoreVersion}" of this client. A client upgrade is needed beforehand.`;
      this.logService.error(message, { projectId }, projectId);
      throw new Error(message);
    }

    if (Semver.eq(project.coreVersion, currentCoreVersion)) {
      // Nothing, since both are equal
      return;
    }

    // Get all available upgrade scripts
    const upgradeFiles = await Util.files(
      Path.resolve(__dirname, '../upgrade'),
      'ts'
    );

    // Import all objects
    const upgrades = (
      await Promise.all(
        upgradeFiles.map((file) => {
          return import(
            Path.join('../upgrade', file.name)
          ) as Promise<ProjectUpgradeImport>;
        })
      )
    ).map((upgradeImport) => {
      return upgradeImport.default;
    });

    // Sort them by core version and filter out the example one
    const sortedUpgrades = upgrades
      .sort((a, b) => {
        return Semver.compare(a.coreVersion, b.coreVersion);
      })
      .filter((upgrade) => {
        if (upgrade.coreVersion !== '0.0.0') {
          return upgrade;
        }
      });

    for (let index = 0; index < sortedUpgrades.length; index++) {
      const upgrade = sortedUpgrades[index];
      if (!upgrade) {
        throw new Error('Expected ProjectUpgrade but got undefined');
      }

      // Make a snapshot to revert to on failure
      // const snapshot = await this.snapshotService.create(projectId, 'Attempting to upgrade Project');

      try {
        await upgrade.run(project);

        // Override the projects core version
        project.coreVersion = upgrade.coreVersion;
        await this.update(project);

        // And create a snapshot
        const message = `Upgraded Project to core version "${project.coreVersion}"`;
        // await this.snapshotService.create(projectId, message);

        // Done, remove the snapshot again
        // await this.snapshotService.delete(projectId, snapshot);
        this.logService.info(message, { projectId }, projectId);
      } catch (error) {
        const message = `Failed to upgrade Project to core version "${upgrade.coreVersion}"`;
        this.logService.error(message, { projectId, error }, projectId);

        // Revert to the snapshot made before
        // await this.snapshotService.revert(projectId, snapshot);
        throw new ProjectUpgradeError(message);
      }
    }
  }

  /**
   * Deletes given Project
   *
   * Deletes the whole Project folder, not only the config file
   *
   * @param projectId ID of the Project to remove
   */
  public async delete(projectId: string): Promise<void> {
    this.logService.debug(
      'Recieved request to delete Project',
      { projectId },
      projectId
    );

    await Fs.remove(Util.pathTo.project(projectId));

    this.logService.info('Deleted Project', { projectId });
  }

  /**
   * Returns the Projects content in a single object
   *
   * @param projectId ID of the Project to export
   */
  public async export(projectId: string) {
    const project = await this.read(projectId);
    const assets = await this.assetService.readAll(projectId);
    const collections = await this.collectionService.readAll(projectId);

    return {
      project,
      assets,
      collections,
    };
  }

  /**
   * Exports and builds the current Project
   *
   * @param projectId ID of the Project to build
   */
  public async build(projectId: string) {
    // const themeConfig = await this.themeService.read(projectId);
    const publicPath = Util.pathTo.public(projectId);
    const themePath = Util.pathTo.theme(projectId);
    const buildPath = Path.join(themePath, 'dist');
    const exportPath = Path.join(themePath, 'project.json');
    const exportData = await this.export(projectId);

    // Export the projects data to the export file, defined by the theme
    await this.jsonFileService.update(exportData, exportPath);

    // Build the Theme
    await this.themeService.build(projectId);

    // Copy the contents of Themes "buildDir" to the Projects public directory
    await Fs.emptyDir(publicPath);
    await Fs.copy(buildPath, publicPath);
  }

  public async list(
    sort: Sort<Project>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<Project>> {
    const modelReferences = await this.listReferences(ModelType.PROJECT);
    const list = await Util.returnResolved(
      modelReferences.map((modelReference) => {
        return this.read(modelReference.id);
      })
    );

    return this.paginate(list, sort, filter, limit, offset);
  }

  public async count(): Promise<number> {
    return (await this.listReferences(ModelType.PROJECT)).length;
  }

  /**
   * Search all models inside the project for given query
   *
   * @param projectId Project ID to search in
   * @param query     Query to search for
   * @param modelType (Optional) specify the ModelType to search for
   */
  public async search(projectId: string, query: string, modelType?: ModelType) {
    return this.searchService.search(projectId, query, modelType);
  }

  /**
   * Checks if given AbstractModel is of type Project
   *
   * @param model The AbstractModel to check
   */
  public isProject(model: AbstractModel): model is Project {
    return model.modelType === ModelType.PROJECT;
  }

  /**
   * Creates a Project from given ProjectConfig
   *
   * @param projectConfig The ProjectConfig to convert
   */
  private async toProject(projectConfig: ProjectConfig): Promise<Project> {
    const projectPath = Util.pathTo.project(projectConfig.id);
    const projectConfigPath = Util.pathTo.projectConfig(projectConfig.id);

    const projectMeta = await this.gitService.getFileCreatedUpdatedMeta(
      projectPath,
      projectConfigPath
    );
    const project = new Project(
      projectConfig,
      projectMeta.created,
      projectMeta.updated
    );

    this.logService.debug(
      'Created Project from ProjectConfig',
      { project, projectConfig },
      project.id
    );

    return project;
  }

  /**
   * Creates the projects folder structure and makes sure to
   * write empty .gitkeep files inside them to ensure they are
   * committed
   */
  private async createFolderStructure(path: string): Promise<void> {
    const folders = Object.values(ProjectFolder);

    await Promise.all(
      folders.map(async (folder) => {
        await Fs.mkdirp(Path.join(path, folder));
        await Fs.writeFile(Path.join(path, folder, '.gitkeep'), '');
      })
    );
  }

  /**
   * Writes the Projects main .gitignore file to disk
   *
   * @todo Add general things to ignore
   * @see https://github.com/github/gitignore/tree/master/Global
   */
  private async createGitignore(path: string): Promise<void> {
    const lines = [
      '# Ignore all hidden files and folders...',
      '.*',
      '# ...but these',
      '!/.gitignore',
      '!/.gitattributes',
      '!/**/.gitkeep',
      '',
      '# elek.io related ignores',
      ProjectFolder.THEME + '/',
      ProjectFolder.PUBLIC + '/',
      ProjectFolder.LOGS + '/',
    ];
    await Fs.writeFile(Path.join(path, '.gitignore'), lines.join(Os.EOL));
  }
}
