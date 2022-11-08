import Util from '../util/index.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { PaginatedList, ServiceType, Sort } from '../type/service.js';
import { ModelReference, ModelType } from '../type/model.js';
import orderBy from 'lodash/orderBy.js';
import remove from 'lodash/remove.js';
import MethodNotSupportedError from '../error/MethodNotSupportedError.js';
import RequiredParameterMissingError from '../error/RequiredParameterMissingError.js';
import { GitCommitIcon } from '../type/git.js';

/**
 * A base service that provides properties for all other services
 */
export default abstract class AbstractService {
  public readonly type: ServiceType;
  public readonly options: ElekIoCoreOptions;

  /**
   * Dynamically generated git messages for operations
   */
  public readonly gitMessage: {
    create: string;
    update: string;
    delete: string;
  };

  /**
   * Do not instantiate directly as this is an abstract class
   */
  protected constructor(type: ServiceType, options: ElekIoCoreOptions) {
    this.type = type;
    this.options = options;
    this.gitMessage = {
      create: `${GitCommitIcon.CREATE} Created new ${this.type}`,
      update: `${GitCommitIcon.UPDATE} Updated ${this.type}`,
      delete: `${GitCommitIcon.DELETE} Deleted ${this.type}`,
    };
  }

  /**
   * Returns the filtered, sorted and paginated version of given list
   *
   * @todo Sorting and filtering requires all models to be loaded
   * from disk. This results in a huge memory spike before the
   * filtering and pagination takes effect - removing most of it again.
   * This approach is still better than returning everything and
   * letting the frontend handle it, since the memory usage would then be constant.
   * But this still could fill the memory limit of node.js (default 1,4 GB).
   *
   * @param list Array to filter, sort and paginate
   * @param sort Array of sort objects containing information about what to sort and how
   * @param filter Filter all object values of `list` by this string
   * @param limit Limit the result to this amount
   * @param offset Start at this index instead of 0
   */
  protected async paginate<T>(
    list: T[],
    sort: Sort<T>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<T>> {
    let result = list;
    const total = list.length;
    const normalizedFilter = filter.trim().toLowerCase();

    // Filter
    if (normalizedFilter !== '') {
      remove(result, (model) => {
        let key: keyof T;
        for (key in model) {
          const value = model[key];
          if (String(value).toLowerCase().includes(normalizedFilter)) {
            return false;
          }
        }
        return true;
      });
    }

    // Sort
    if (sort.length !== 0) {
      const keys = sort.map((value) => value.by);
      const orders = sort.map((value) => value.order);
      result = orderBy(result, keys, orders);
    }

    // Paginate
    if (limit !== 0) {
      result = result.slice(offset, offset + limit);
    }

    return {
      total,
      limit,
      offset,
      list: result,
    };
  }

  /**
   * Returns a list of all model references of given project and model type
   *
   * @todo maybe change ModelType to generic this.type (ServiceType)?
   *
   * @param type Model type of the references wanted
   * @param projectId Project to get all asset references from
   */
  protected async listReferences(
    type: ModelType,
    projectId?: string,
    collectionId?: string
  ): Promise<ModelReference[]> {
    switch (type) {
      case ModelType.ASSET:
        if (!projectId) {
          throw new RequiredParameterMissingError('projectId');
        }
        return this.getFileModelReferences(Util.pathTo.assets(projectId), type);
      case ModelType.PROJECT:
        return this.getFolderModelReferences(Util.pathTo.projects);
      case ModelType.COLLECTION:
        if (!projectId) {
          throw new RequiredParameterMissingError('projectId');
        }
        return this.getFolderModelReferences(
          Util.pathTo.collections(projectId)
        );
      case ModelType.COLLECTION_ITEM:
        if (!projectId) {
          throw new RequiredParameterMissingError('projectId');
        }
        if (!collectionId) {
          throw new RequiredParameterMissingError('collectionId');
        }
        return this.getFileModelReferences(
          Util.pathTo.collectionItems(projectId, collectionId),
          type
        );
      case ModelType.FIELD:
        if (!projectId) {
          throw new RequiredParameterMissingError('projectId');
        }
        return this.getFileModelReferences(Util.pathTo.fields(projectId), type);
      case ModelType.SNAPSHOT:
        throw new MethodNotSupportedError();
      default:
        throw new Error(`Unsupported model type "${type}"`);
    }
  }

  private async getFolderModelReferences(
    path: string
  ): Promise<ModelReference[]> {
    const possibleModels = await Util.subdirectories(path);
    const results = possibleModels.map((possibleProjectDirectory) => {
      if (Util.validator.isUuid(possibleProjectDirectory.name) === false) {
        return null;
      }
      return {
        id: possibleProjectDirectory.name,
        language: null,
        extension: null,
      };
    });

    return results.filter(Util.notEmpty);
  }

  /**
   * Searches for all models inside given folder,
   * parses their names and returns them
   */
  private async getFileModelReferences(
    path: string,
    modelType: ModelType
  ): Promise<ModelReference[]> {
    const modelsWithLanguage = [
      ModelType.COLLECTION_ITEM,
      ModelType.FIELD,
      ModelType.ASSET,
    ];
    const possibleModels = await Util.files(path);

    const results = await Promise.all(
      possibleModels.map(async (possibleModel) => {
        const fileNameArray = possibleModel.name.split('.');

        const id = fileNameArray[0];
        let language = null;
        let extension = null;

        if (typeof id !== 'string' || Util.validator.isUuid(id) === false) {
          return null;
        }

        if (modelsWithLanguage.includes(modelType)) {
          if (
            fileNameArray.length !== 3 ||
            typeof fileNameArray[1] !== 'string' ||
            Util.validator.isLanguageTag(fileNameArray[1]) === false
          ) {
            return null;
          }
          language = fileNameArray[1];
          extension = fileNameArray[2];
        } else {
          if (fileNameArray.length !== 2) {
            return null;
          }
          extension = fileNameArray[1];
        }

        if (extension !== 'json' && extension !== 'md') {
          return null;
        }

        return { id, language, extension };
      })
    );

    return results.filter(Util.notEmpty);
  }
}
