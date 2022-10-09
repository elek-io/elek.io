import Fs from 'fs-extra';
import IsSvg from 'is-svg';
import { ElekIoCoreOptions } from '../type/general.js';
import { ModelType } from '../type/model.js';
import {
  ExtendedCrudService,
  PaginatedList,
  ServiceType,
  Sort,
} from '../type/service.js';
import AbstractModel from '../model/AbstractModel.js';
import AssetConfig from '../model/AssetConfig.js';
import Util from '../util/index.js';
import GitService from './GitService.js';
import JsonFileService from './JsonFileService.js';
import {
  SupportedExtension,
  supportedExtensions,
  SupportedMimeType,
  supportedMimeTypes,
} from '../type/asset.js';
import Asset from '../model/Asset.js';
import FileTypeNotSupportedError from '../error/FileTypeNotSupportedError.js';
import AbstractService from './AbstractService.js';
import RequiredParameterMissingError from '../error/RequiredParameterMissingError.js';
import LogService from './LogService.js';
import { ReferenceWithLanguage } from '../type/field.js';

/**
 * Service that manages CRUD functionality for Asset files on disk
 */
export default class AssetService
  extends AbstractService
  implements ExtendedCrudService<Asset>
{
  private readonly logService: LogService;
  private readonly jsonFileService: JsonFileService;
  private readonly gitService: GitService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService
  ) {
    super(ServiceType.ASSET, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
  }

  /**
   * Creates a new Asset
   *
   * @param filePath    Path of the file to add as a new Asset
   * @param projectId   Project ID of the Asset to create
   * @param language    Language of the new Asset
   * @param name        Name of the new Asset
   * @param description Description of the new Asset
   */
  public async create(
    filePath: string,
    projectId: string,
    language: string,
    name: string,
    description: string
  ): Promise<Asset> {
    this.logService.debug(
      'Recieved request to create Asset',
      { filePath, language, name, description },
      projectId
    );

    const id = Util.uuid();
    const projectPath = Util.pathTo.project(projectId);
    const fileType = await this.getSupportedFileTypeOrThrow(filePath);
    const assetConfig = new AssetConfig(
      id,
      language,
      name,
      description,
      fileType.extension,
      fileType.mimeType
    );
    const assetFilePath = Util.pathTo.assetFile(
      projectId,
      assetConfig.id,
      assetConfig.language,
      assetConfig.extension
    );
    const assetConfigPath = Util.pathTo.assetConfig(
      projectId,
      assetConfig.id,
      assetConfig.language
    );

    this.logService.debug(
      'Created AssetConfig',
      { assetConfig, assetConfigPath, assetFilePath },
      projectId
    );

    await Fs.copyFile(filePath, assetFilePath);
    await this.jsonFileService.create(assetConfig, assetConfigPath);
    await this.gitService.add(projectPath, [assetConfigPath, assetFilePath]);
    await this.gitService.commit(projectPath, this.gitMessage.create);

    const asset = await this.toAsset(projectId, assetConfig);

    this.logService.info('Created Asset', { asset }, projectId);

    return asset;
  }

  /**
   * Returns an Asset by ID and language
   *
   * @param projectId Project ID of the Asset to read
   * @param id        ID of the Asset to read
   * @param language  Language of the Asset to read
   */
  public async read(
    projectId: string,
    id: string,
    language: string
  ): Promise<Asset> {
    this.logService.debug(
      'Recieved request to read Asset',
      { id, language },
      projectId
    );

    const json = await this.jsonFileService.read<AssetConfig>(
      Util.pathTo.assetConfig(projectId, id, language)
    );

    this.logService.debug('Read AssetConfig from disk', { json }, projectId);

    const assetConfig = new AssetConfig(
      json.id,
      json.language,
      json.name,
      json.description,
      json.extension,
      json.mimeType
    );

    this.logService.debug(
      'Created AssetConfig model',
      { assetConfig },
      projectId
    );

    return this.toAsset(projectId, assetConfig);
  }

  /**
   * Reads and returns all Assets. If references are given,
   * only referenced Assets are read and returned
   *
   * @param projectId   The Project ID to load the Assets from
   * @param references  (Optional) List of Assets to read instead of all
   */
  public async readAll(
    projectId: string,
    references?: ReferenceWithLanguage[]
  ): Promise<Asset[]> {
    if (!references) {
      return (await this.list(projectId, undefined, undefined, 0, 0)).list;
    }

    const readPromises = references.map((reference) => {
      return this.read(projectId, reference.id, reference.language);
    });
    return Promise.all(readPromises);
  }

  /**
   * Updates given Asset
   *
   * Please note that the Asset inself (e.g. an image or zip file)
   * cannot be updated and needs to be recreated.
   * The update only affects the meta information like name and description.
   *
   * @todo Check why updating the file itself might not be possible
   *
   * @param projectId Project ID of the Asset to update
   * @param asset     Asset to update
   */
  public async update(projectId: string, asset: Asset): Promise<void> {
    this.logService.debug(
      'Recieved request to update Asset',
      { asset },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const assetConfig = new AssetConfig(
      asset.id,
      asset.language,
      asset.name,
      asset.description,
      asset.extension,
      asset.mimeType
    );
    const assetConfigPath = Util.pathTo.assetConfig(
      projectId,
      asset.id,
      asset.language
    );
    await this.jsonFileService.update(assetConfig, assetConfigPath);
    await this.gitService.add(projectPath, [assetConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.update);

    this.logService.info('Updated Asset', { asset }, projectId);
  }

  /**
   * Deletes given Asset
   *
   * @param projectId Project ID of the Asset to delete
   * @param id        ID of the Asset to delete
   * @param language  Language of the Asset to delete
   * @param extension Extension of the Asset to delete
   */
  public async delete(
    projectId: string,
    id: string,
    language: string,
    extension: SupportedExtension
  ): Promise<void> {
    this.logService.debug(
      'Recieved request to delete Asset',
      { id, language, extension },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const assetConfigPath = Util.pathTo.assetConfig(projectId, id, language);
    const assetFilePath = Util.pathTo.assetFile(
      projectId,
      id,
      language,
      extension
    );
    await Fs.remove(assetFilePath);
    await Fs.remove(assetConfigPath);
    await this.gitService.add(projectPath, [assetConfigPath, assetFilePath]);
    await this.gitService.commit(projectPath, this.gitMessage.delete);

    this.logService.info(
      'Deleted Asset',
      { id, language, extension },
      projectId
    );
  }

  public async list(
    projectId: string,
    sort: Sort<Asset>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<Asset>> {
    this.logService.debug(
      'Recieved request to list Assets',
      { sort, filter, limit, offset },
      projectId
    );

    const modelReferences = await this.listReferences(
      ModelType.ASSET,
      projectId
    );
    const list = await Util.returnResolved(
      modelReferences.map((modelReference) => {
        if (!modelReference.language) {
          throw new RequiredParameterMissingError('language');
        }
        return this.read(projectId, modelReference.id, modelReference.language);
      })
    );

    const paginatedResult = this.paginate(list, sort, filter, limit, offset);

    this.logService.debug(
      'Listed Assets',
      { sort, filter, limit, offset, paginatedResult },
      projectId
    );

    return paginatedResult;
  }

  public async count(projectId: string): Promise<number> {
    this.logService.debug('Recieved request to count Assets', {}, projectId);

    const count = (await this.listReferences(ModelType.ASSET, projectId))
      .length;

    this.logService.debug('Counted Assets', { count }, projectId);

    return count;
  }

  /**
   * Checks if given AbstractModel is of type Asset
   *
   * @param model The AbstractModel to check
   */
  public isAsset(model: AbstractModel): model is Asset {
    return model.modelType === ModelType.ASSET;
  }

  /**
   * Creates a Asset from given AssetConfig
   *
   * @param projectId   The project's ID
   * @param assetConfig The AssetConfig to convert
   */
  private async toAsset(
    projectId: string,
    assetConfig: AssetConfig
  ): Promise<Asset> {
    const projectPath = Util.pathTo.project(projectId);
    const assetConfigPath = Util.pathTo.assetConfig(
      projectId,
      assetConfig.id,
      assetConfig.language
    );
    const assetFilePath = Util.pathTo.assetFile(
      projectId,
      assetConfig.id,
      assetConfig.language,
      assetConfig.extension
    );

    const assetSize = (await Fs.stat(assetFilePath)).size;
    const assetConfigMeta = await this.gitService.getFileCreatedUpdatedMeta(
      projectPath,
      assetConfigPath
    );

    const asset = new Asset(
      assetConfig,
      assetConfigMeta.created,
      assetConfigMeta.updated,
      assetFilePath,
      assetSize
    );

    this.logService.debug(
      'Created new Asset from AssetConfig',
      { asset, assetConfig },
      projectId
    );

    return asset;
  }

  /**
   * Returns the found and supported extension as well as mime type,
   * otherwise throws an error
   *
   * @param filePath Path to the file to check
   */
  private async getSupportedFileTypeOrThrow(filePath: string) {
    const fileSize = (await Fs.stat(filePath)).size;

    // Only try to parse potential SVG's
    // that are smaller than 500 kB
    if (fileSize / 1000 <= 500) {
      const fileBuffer = await Fs.readFile(filePath);
      if (IsSvg(fileBuffer) === true) {
        return {
          extension: 'svg' as SupportedExtension,
          mimeType: 'image/svg+xml' as SupportedMimeType,
        };
      }
    }

    // We do not use fileBuffer here again because fromFile() is recommended
    // @todo And a dynamic import is needed, because otherwise client is throwing 
    // "Error [ERR_REQUIRE_ESM]: require() of ES Module .../node_modules/file-type/index.js from ... not supported."
    const { fileTypeFromFile } = await import('file-type');
    const fileType = await fileTypeFromFile(filePath);

    if (!fileType) {
      throw new Error(`Could not retrieve the type of file "${filePath}"`);
    }

    if (
      supportedExtensions.includes(fileType.ext as SupportedExtension) === false
    ) {
      throw new FileTypeNotSupportedError(
        `The extension "${fileType.ext}" is not supported`
      );
    }

    if (
      supportedMimeTypes.includes(fileType.mime as SupportedMimeType) === false
    ) {
      throw new FileTypeNotSupportedError(
        `The MIME type "${fileType.mime}" is not supported`
      );
    }

    return {
      extension: fileType.ext as SupportedExtension,
      mimeType: fileType.mime as SupportedMimeType,
    };
  }
}
