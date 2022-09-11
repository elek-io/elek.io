import Fs from 'fs-extra';
import Util from './util/index.js';
import AssetService from './service/AssetService.js';
import EventService from './service/EventService.js';
import JsonFileService from './service/JsonFileService.js';
import ProjectService from './service/ProjectService.js';
import LogService from './service/LogService.js';
import { ElekIoCoreOptions, Optional } from './type/general.js';
import SnapshotService from './service/SnapshotService.js';
import GitService from './service/GitService.js';
import ThemeService from './service/ThemeService.js';
import SearchService from './service/SearchService.js';
import CollectionService from './service/CollectionService.js';
import CollectionItemService from './service/CollectionItemService.js';
import FieldService from './service/FieldService.js';
import PodmanService from './service/PodmanService.js';

/**
 * elek.io core
 *
 * Provides access to all services from the outside.
 */
export default class ElekIoCore {
  private readonly options: ElekIoCoreOptions;
  private readonly logService: LogService;
  private readonly eventService: EventService;
  private readonly gitService: GitService;
  private readonly podmanService: PodmanService;
  private readonly snapshotService: SnapshotService;
  private readonly jsonFileService: JsonFileService;
  private readonly themeService: ThemeService;
  private readonly assetService: AssetService;
  private readonly searchService: SearchService;
  private readonly projectService: ProjectService;
  private readonly collectionService: CollectionService;
  private readonly collectionItemService: CollectionItemService;
  private readonly fieldService: FieldService;

  /**
   * Do not instantiate directly as the init method has to be called
   */
  private constructor(
    options: Optional<ElekIoCoreOptions, 'locale' | 'file' | 'log'>
  ) {
    const defaults: Omit<ElekIoCoreOptions, 'signature'> = {
      locale: {
        id: 'en',
        name: 'English',
      },
      file: {
        json: {
          indentation: 2,
        },
      },
      log: {
        debug: false,
      },
    };
    this.options = Object.assign({}, defaults, options);

    this.eventService = new EventService(this.options);
    this.logService = new LogService(this.options, this.eventService);
    this.gitService = new GitService(this.options, this.logService);
    this.podmanService = new PodmanService(this.options, this.logService);
    this.snapshotService = new SnapshotService(
      this.options,
      this.eventService,
      this.gitService
    );
    this.jsonFileService = new JsonFileService(this.options, this.logService);
    this.themeService = new ThemeService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService,
      this.podmanService
    );
    this.assetService = new AssetService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService
    );
    this.collectionItemService = new CollectionItemService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService
    );
    this.fieldService = new FieldService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService,
      this.assetService
    );
    this.collectionService = new CollectionService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService,
      this.collectionItemService,
      this.fieldService
    );
    this.searchService = new SearchService(
      this.options,
      this.assetService,
      this.collectionService
    );
    this.projectService = new ProjectService(
      this.options,
      this.logService,
      this.jsonFileService,
      this.gitService,
      this.themeService,
      this.searchService,
      this.assetService,
      this.collectionService,
      this.snapshotService
    );

    if (process.env.NODE_ENV !== 'production') {
      this.logService.info(
        `Initializing inside an "${process.env.NODE_ENV}" environment`,
        { environment: process.env, options: this.options }
      );
    }
  }

  /**
   * Initializes elek.io core by assuring the basic requirements are met.
   *
   * Checks if the "NODE_ENV" variable is available,
   * assures the directory structure is there
   * and empties the tmp directory.
   */
  public static async init(
    options: Optional<ElekIoCoreOptions, 'locale' | 'file' | 'log'>
  ): Promise<ElekIoCore> {
    if (!process.env.NODE_ENV) {
      throw new Error('Environment variable "NODE_ENV" is not set');
    }
    await Promise.all([
      Fs.mkdirp(Util.pathTo.logs),
      Fs.mkdirp(Util.pathTo.projects),
      Fs.mkdirp(Util.pathTo.tmp),
    ]);

    await Fs.emptyDir(Util.pathTo.tmp);

    return new ElekIoCore(options);
  }

  /**
   * Endpoint to subscribe to internal events and react to accordingly
   *
   * @todo figure out if we really want outside code be able to call emit()
   */
  public get event() {
    return {
      on: this.eventService.on,
      emit: this.eventService.emit,
    };
  }

  public get util() {
    return Util;
  }

  public get podman(): PodmanService {
    return this.podmanService;
  }

  /**
   * CRUD methods to work with projects
   */
  public get projects(): ProjectService {
    return this.projectService;
  }

  /**
   * CRUD methods to work with assets
   */
  public get assets(): AssetService {
    return this.assetService;
  }

  /**
   * CRUD methods to work with snapshots
   */
  public get snapshots(): SnapshotService {
    return this.snapshotService;
  }

  /**
   * CRUD methods to work with collections
   */
  public get collections(): CollectionService {
    return this.collectionService;
  }

  /**
   * CRUD methods to work with collection items
   */
  public get collectionItems(): CollectionItemService {
    return this.collectionItemService;
  }

  /**
   * CRUD methods to work with fields
   */
  public get fields(): FieldService {
    return this.fieldService;
  }

  /**
   * CRUD methods to work with the theme
   */
  public get theme(): ThemeService {
    return this.themeService;
  }

  // /**
  //  * @todo Hacked together for now, refactor
  //  *
  //  * @param project
  //  */
  // public async export(project: Project) {
  //   const theme = await this.theme.read(project);
  //   const paginatedPagesList = await this.pages.list(project);
  //   return {
  //     ...project,
  //     pages: await Promise.all(paginatedPagesList.list.flat().map( async (page) => {
  //       const layout = theme.layouts.find((layout) => {
  //         return layout.id === page.layoutId;
  //       });
  //       if (!layout) { throw new Error('Layout not found'); }
  //       const layoutPositions = await this.themeService.getPositions(project, layout);
  //       return {
  //         name: page.name,
  //         language: page.language,
  //         layout: {
  //           id: layout.id,
  //           path: layout.path
  //         },
  //         uriPath: page.uriPath,
  //         content: await Promise.all(page.content.map( async (contentRef) => {
  //           const block = await this.blockService.read(project, contentRef.blockId, page.language);
  //           const blockPosition = layoutPositions.blocks.find((position) => {
  //             return position.id === contentRef.positionId;
  //           });
  //           if (!blockPosition) { throw new Error('Block position not found'); }
  //           return {
  //             id: contentRef.positionId,
  //             html: this.blockService.render(block, blockPosition.restrictions)
  //           };
  //         }))
  //       };
  //     }))
  //   };
  // }

  // /**
  //  * Builds given project by hydrating the theme with the projects information
  //  * and saving the outcome to the projects "public" directory
  //  *
  //  * @todo check how to prevent remote code execution here,
  //  * since running a user defined command is generally a very bad idea...
  //  *
  //  * Ok, so this seems to be one of the main challenges to get this project going.
  //  * Currently this solution works. For a developer it might be ok to write a theme,
  //  * then using it like this - he wrote the code himself. But for an end-user this is horrible.
  //  * Using a theme like this means running external code with full access on your private
  //  * or companies computer. E.g. a theme update now containing a "rm -rf /" as the build command.
  //  *
  //  * A few (not so great) solutions that come to my mind:
  //  * - Do not use npm run to execute self defined commands. Instead direktly invoke e.g. the Vue CLI.
  //  *   = a bit more secure but not really
  //  * - Use a container technology to execute code in (Docker etc.)
  //  *   = better security, more overhead and complexity
  //  * - Use a VM technology to execute code in (VirtualBox etc.)
  //  *   = even more overhead & complexity but also more secure
  //  * - Just don't allow themes to be build locally if they are not from a trusted source
  //  *   = limits the usability
  //  */
  // public async build(project: Project): Promise<void> {
  //   const theme = await this.themeService.read(project);
  //   const themePath = Util.pathTo.theme(project.id);
  //   const exportPath = Path.join(themePath, theme.exportFile);
  //   const exportData = await this.export(project);
  //   const buildPath = Path.join(themePath, theme.buildDir);
  //   const publicPath = Util.pathTo.public(project.id);

  //   // Export the projects data to the export file, defined by the theme
  //   await this.jsonFileService.update(exportData, exportPath);

  //   // Install the themes dependencies
  //   await Util.spawnChildProcess('npm', ['install'], {
  //     cwd: Path.join(themePath)
  //   });

  //   // Run the build script which uses the exported json
  //   // to hydrate the themes content
  //   await Util.spawnChildProcess('npm', ['run', 'build'], {
  //     cwd: Path.join(themePath)
  //   });

  //   // Copy the contents of themes "buildDir" to the projects public directory
  //   // where it's available from outside
  //   await Fs.emptyDir(publicPath);
  //   await Fs.copy(buildPath, publicPath);
  // }
}
