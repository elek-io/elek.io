import Fs from 'fs-extra';
import Path from 'path';
import Cheerio from 'cheerio';
import { ElekIoCoreOptions } from '../type/general.js';
import { BlockRestrictions, BlockRule } from '../type/block.js';
import Project from '../model/Project.js';
import ThemeConfig from '../model/ThemeConfig.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import LogService from './LogService.js';
import GitService from './GitService.js';
import JsonFileService from './JsonFileService.js';
import {
  ThemeLayoutBlockPosition,
  ThemeLayout,
  ThemeLayoutElementPosition,
  ThemeLayoutElementType,
} from '../type/theme.js';
import { ServiceType } from '../type/service.js';
import PodmanService from './PodmanService.js';

/**
 * Service that manages CRUD functionality for the theme in use
 */
export default class ThemeService extends AbstractService {
  private logService: LogService;
  private jsonFileService: JsonFileService;
  private gitService: GitService;
  private podmanService: PodmanService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService,
    podmanService: PodmanService
  ) {
    super(ServiceType.THEME, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
    this.podmanService = podmanService;
  }

  /**
   * Changes the Theme in use by downloading
   * a new one from a remote repository
   *
   * @param projectId ID of the Project to change the Theme of
   * @param url       URL to the repository to clone
   */
  public async use(projectId: string, url: string): Promise<void> {
    this.logService.debug(
      'Recieved request to use a different Theme',
      { url },
      projectId
    );

    await this.delete(projectId);
    // Clone only the main branch with a history depth of 1
    // to save resources and time
    await this.gitService.clone(url, Util.pathTo.theme(projectId), {
      singleBranch: true,
      depth: 1,
    });

    this.logService.info('Using new Theme', { url }, projectId);
  }

  /**
   * Returns the currently used Theme
   *
   * @param projectId Project ID of the Theme to read
   */
  public async read(projectId: string): Promise<ThemeConfig> {
    this.logService.debug('Recieved request to read Theme', {}, projectId);

    const json = await this.jsonFileService.read<ThemeConfig>(
      Util.pathTo.themeConfig(projectId)
    );

    this.logService.debug('Read ThemeConfig from disk', { json }, projectId);

    const themeConfig = new ThemeConfig(
      json.name,
      json.description,
      json.version,
      json.homepage,
      json.repository,
      json.author,
      json.license,
      json.layouts
    );

    this.logService.debug(
      'Created ThemeConfig model',
      { themeConfig },
      projectId
    );

    return themeConfig;
  }

  /**
   * Updates the current Theme on disk by pulling
   * the latest changes from the remote repository
   *
   * @todo Implement logic to check for layout ID changes
   * and maybe map between both versions if needed
   *
   * @param projectId Project ID of the Theme to update
   */
  public async update(projectId: string): Promise<void> {
    this.logService.debug('Recieved request to update Theme', {}, projectId);

    await this.gitService.pull(Util.pathTo.theme(projectId));

    this.logService.info('Updated Theme', {}, projectId);
  }

  /**
   * Deletes the current Theme from disk
   *
   * @param projectId ID of the Project to delete the Theme from
   */
  public async delete(projectId: string): Promise<void> {
    this.logService.debug('Recieved request to delete Theme', {}, projectId);

    await Fs.emptyDir(Util.pathTo.theme(projectId));

    this.logService.info('Deleted Theme', {}, projectId);
  }

  /**
   * Builds the current Theme
   *
   * Make sure the JSON file was exported into the Themes directory
   * before running this command
   *
   * @param projectId ID of the Project to build the Theme of
   */
  public async build(projectId: string): Promise<void> {
    const themeConfig = await this.read(projectId);
    await this.podmanService.build(
      themeConfig.name,
      Util.pathTo.theme(projectId)
    );
    await this.podmanService.run(themeConfig.name);
  }

  // /**
  //  * Looks for block and element positions in given layout of the theme,
  //  * parses their block restrictions and element type and returns the result
  //  *
  //  * @param project Project of the layout
  //  * @param layout Layout to get block and element positions from
  //  */
  // public async getPositions(project: Project, layout: ThemeLayout): Promise<{
  //   blocks: ThemeLayoutBlockPosition[];
  //   elements: ThemeLayoutElementPosition[];
  // }> {
  //   const layoutContent = await Fs.readFile(Path.join(Util.pathTo.theme(project.id), layout.path));
  //   const $ = Cheerio.load(layoutContent, {
  //     // Needed to parse uppercase / lowercase combinations used in frameworks like Vue.js
  //     xmlMode: true
  //   });
  //   return {
  //     blocks: await this.getBlockPositions($),
  //     elements: await this.getElementPositions($)
  //   };
  // }

  // private async getBlockPositions($: any) {
  //   const blockPositions: ThemeLayoutBlockPosition[] = [];
  //   const defaultRestrictions: BlockRestrictions = {
  //     only: [],
  //     not: [],
  //     minimum: 0,
  //     maximum: 0,
  //     required: false,
  //     inline: false,
  //     breaks: false,
  //     html: false,
  //     highlightCode: false,
  //     repeatable: false
  //   };
  //   const blockSelector = `${this.options.theme.htmlPrefix}-block`;
  //   $(`[${blockSelector}]`).map( async (index: any, block: { attribs: { [x: string]: any; }; }) => {
  //     const id = block.attribs[`${blockSelector}`];
  //     const partialRestrictions = await this.parseRestrictions(block.attribs);
  //     blockPositions.push({
  //       id,
  //       restrictions: Util.assignDefaultIfMissing(partialRestrictions, defaultRestrictions)
  //     });
  //   });
  //   return blockPositions;
  // }

  // private async getElementPositions($: any) {
  //   const elementSelector = `${this.options.theme.htmlPrefix}-element`;
  //   const elementPositions: ThemeLayoutElementPosition[] = [];
  //   $(`[${elementSelector}]`).map( async (index: any, element: { attribs: { [x: string]: any; }; }) => {
  //     const id = element.attribs[`${elementSelector}`];
  //     const type = element.attribs[`${elementSelector}-type`];
  //     if (type && this.isThemeLayoutElementType(type)) {
  //       elementPositions.push({
  //         id,
  //         type
  //       });
  //     }
  //   });
  //   return elementPositions;
  // }

  private isThemeLayoutElementType(
    value: string
  ): value is ThemeLayoutElementType {
    return Object.values(ThemeLayoutElementType).includes(
      value as ThemeLayoutElementType
    );
  }

  /**
   * Parses given HTML attributes and returns an partial BlockRestrictions object
   */
  private async parseRestrictions(attributes: any) {
    const restrictions: Partial<BlockRestrictions> = {};

    for (const key in attributes) {
      const attribute = attributes[key];

      // BlockRules
      if (key === 'only' || key === 'not') {
        restrictions[key] = await this.parseBlockRule(attribute);
      }

      // Numbers
      if (key === 'minimum' || key === 'maximum') {
        restrictions[key] = await this.parseNumber(attribute, key);
      }

      // Booleans
      if (
        key === 'inline' ||
        key === 'breaks' ||
        key === 'html' ||
        key === 'highlightCode' ||
        key === 'repeatable'
      ) {
        restrictions[key] = await this.parseBoolean(attribute, key);
      }
    }

    return restrictions;
  }

  private async parseBlockRule(attribute: string) {
    return attribute
      .split(',')
      .filter((value) => {
        return Object.values(BlockRule).includes(value.trim() as BlockRule);
      })
      .map((value) => {
        return <BlockRule>value.trim();
      });
  }

  private async parseNumber(attribute: string, key: string) {
    const value = parseInt(attribute);
    if (value < 0) {
      throw new Error(
        `Found negative value "${value}" for restriction "${key}"`
      );
    }
    return value;
  }

  private async parseBoolean(attribute: string, key: string) {
    if (attribute !== 'true' && attribute !== 'false') {
      throw new Error(
        `Expected boolean value for restriction "${key}", got "${attribute}"`
      );
    }
    if (attribute === 'true') {
      return true;
    }
    return false;
  }
}
