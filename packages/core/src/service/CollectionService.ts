import { FieldDefinition } from '../type/field.js';
import { ElekIoCoreOptions, TranslatableString } from '../type/general.js';
import { ModelType } from '../type/model.js';
import {
  ExtendedCrudService,
  PaginatedList,
  ServiceType,
  Sort,
} from '../type/service.js';
import Fs from 'fs-extra';
import AbstractModel from '../model/AbstractModel.js';
import CollectionConfig from '../model/CollectionConfig.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import GitService from './GitService.js';
import JsonFileService from './JsonFileService.js';
import CollectionItemService from './CollectionItemService.js';
import FieldService from './FieldService.js';
import isEqual from 'lodash/isEqual.js';
import { Violation } from '../type/violation.js';
import LogService from './LogService.js';
import Collection from '../model/Collection.js';
import { CollectionUpdateResult } from '../type/collection.js';

/**
 * Service that manages CRUD functionality for Collection files on disk
 */
export default class CollectionService
  extends AbstractService
  implements ExtendedCrudService<Collection>
{
  private logService: LogService;
  private jsonFileService: JsonFileService;
  private gitService: GitService;
  private collectionItemService: CollectionItemService;
  private fieldService: FieldService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService,
    collectionItemService: CollectionItemService,
    fieldService: FieldService
  ) {
    super(ServiceType.COLLECTION, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
    this.collectionItemService = collectionItemService;
    this.fieldService = fieldService;
  }

  /**
   * Creates a new Collection
   *
   * @param projectId         ID of the Project of the Collection to create
   * @param name              Name of the Collection to create
   * @param description       Description of the Collection to create
   * @param icon              Icon of the Collection to create
   * @param fieldDefinitions  Array of field definitions of the Collection to create
   */
  public async create(
    projectId: string,
    name: TranslatableString,
    description: TranslatableString,
    icon: string,
    fieldDefinitions: FieldDefinition[]
  ): Promise<Collection> {
    this.logService.debug(
      'Recieved request to create Collection',
      { name, description, icon, fieldDefinitions },
      projectId
    );

    const id = Util.uuid();
    const projectPath = Util.pathTo.project(projectId);
    const collectionConfig = new CollectionConfig(
      id,
      name,
      description,
      icon,
      fieldDefinitions
    );
    const collectionPath = Util.pathTo.collection(
      projectId,
      collectionConfig.id
    );
    const collectionConfigPath = Util.pathTo.collectionConfig(
      projectId,
      collectionConfig.id
    );

    this.logService.debug(
      'Created CollectionConfig',
      { collectionConfig, collectionPath, collectionConfigPath },
      projectId
    );

    await Fs.ensureDir(collectionPath);
    await this.jsonFileService.create(collectionConfig, collectionConfigPath);
    await this.gitService.add(projectPath, [collectionConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.create);

    const collection = await this.toCollection(projectId, collectionConfig);

    this.logService.info('Created Collection', { collection }, projectId);

    return collection;
  }

  /**
   * Returns a Collection by ID
   *
   * @param projectId Project ID of the Collection to read
   * @param id        ID of the Collection to read
   */
  public async read(projectId: string, id: string): Promise<Collection> {
    this.logService.debug(
      'Recieved request to read Collection',
      { id },
      projectId
    );

    const json = await this.jsonFileService.read<CollectionConfig>(
      Util.pathTo.collectionConfig(projectId, id)
    );

    this.logService.debug(
      'Read CollectionConfig from disk',
      { json },
      projectId
    );

    const collectionConfig = new CollectionConfig(
      json.id,
      json.name,
      json.description,
      json.icon,
      json.fieldDefinitions
    );

    this.logService.debug(
      'Created CollectionConfig model',
      { collectionConfig },
      projectId
    );

    return this.toCollection(projectId, collectionConfig);
  }

  /**
   * Reads and returns all Collections
   *
   * @param projectId   The Project ID to load the Collections from
   */
  public async readAll(projectId: string): Promise<Collection[]> {
    return (await this.list(projectId, undefined, undefined, 0, 0)).list;
  }

  /**
   * Updates given Collection
   *
   * @todo finish implementing checks for FieldDefinitions and extract methods
   *
   * @param projectId   Project ID of the collection to update
   * @param collection  Collection to write to disk
   * @returns           An object containing information about the actions needed to be taken,
   *                    before given update can be executed or void if the update was executed successfully
   */
  public async update(
    projectId: string,
    collection: Collection
  ): Promise<CollectionUpdateResult> {
    this.logService.debug(
      'Recieved request to update Collection',
      { collection },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const collectionConfigPath = Util.pathTo.collectionConfig(
      projectId,
      collection.id
    );

    const result: CollectionUpdateResult = {
      create: [],
      update: [],
      delete: [],
    };

    const currentCollection = await this.read(projectId, collection.id);
    // Iterate over all FieldDefinitions and check each for changes
    for (let index = 0; index < collection.fieldDefinitions.length; index++) {
      const nextFieldDefinition = collection.fieldDefinitions[index];
      if (!nextFieldDefinition) {
        throw new Error('Could not find any field definition');
      }
      // Get the correct FieldDefinition by ID
      const currentFieldDefinition = currentCollection.fieldDefinitions.find(
        (current) => {
          return current.id === nextFieldDefinition.id;
        }
      );
      if (currentFieldDefinition) {
        if (
          currentFieldDefinition.isRequired === false &&
          nextFieldDefinition.isRequired === true
        ) {
          // Case 1.
          // A FieldDefinition was not required to be filled, but is now
          // -> Check if all CollectionItems have a FieldReference to this definition (if not create)
          // -> Check all values of referenced fields of this definition for null (if not update)
          // -> If the value is null, this is a violation
          const collectionItems = (
            await this.collectionItemService.list(
              projectId,
              collection.id,
              undefined,
              undefined,
              0,
              0
            )
          ).list;
          for (let index = 0; index < collectionItems.length; index++) {
            const collectionItem = collectionItems[index];
            if (!collectionItem) {
              throw new Error('Blaa');
            }
            const fieldReference = collectionItem.fieldReferences.find(
              (fieldReference) => {
                return (
                  fieldReference.fieldDefinitionId === nextFieldDefinition.id
                );
              }
            );
            if (!fieldReference) {
              result.create.push({
                violation: Violation.FIELD_REQUIRED_BUT_UNDEFINED,
                collectionItem,
                fieldDefinition: nextFieldDefinition,
              });
            } else {
              const field = await this.fieldService.read(
                projectId,
                fieldReference.field.id,
                fieldReference.field.language
              );
              if (field.value === null) {
                result.update.push({
                  violation: Violation.FIELD_VALUE_REQUIRED_BUT_NULL,
                  collectionItem,
                  fieldReference,
                });
              }
            }
          }
        }
        if (
          currentFieldDefinition.isUnique !== nextFieldDefinition.isUnique &&
          nextFieldDefinition.isUnique === true
        ) {
          // Case 2.
          // A FieldDefinition was not required to be unique, but is now
          // -> Check all current values of referenced fields
          // -> If a value is not unique, this is a violation
          // const fieldReferences = await this.collectionItemService.getAllFieldReferences(project, currentCollection, currentFieldDefinition.id);
          // const fields = await this.fieldService.readAll(project, fieldReferences);
          // const duplicates = Util.getDuplicates(fields, 'value');
          // for (let index = 0; index < duplicates.length; index++) {
          //   const duplicate = duplicates[index];
          //   result.update.push({
          //     violation: Violation.FIELD_VALUE_NOT_UNIQUE,
          //     collectionItem: ,
          //     fieldReference
          //   });
          // }
        }
        if (
          isEqual(currentFieldDefinition.input, nextFieldDefinition.input) ===
          false
        ) {
          // Case 3.
          // A FieldDefinition has a new input specification
          // -> Check if this input is valid for given FieldType
          // -> If not, this is a violation
        }
      } else {
        // It's a new FieldDefinition that was not existing before
        if (nextFieldDefinition.isRequired) {
          // Case 4.
          // A FieldDefinition is new and a field (with value) required
          // -> The user needs to add a field reference (either through a new or existing field)
          // for every CollectionItem of this Collection
          const collectionItems = (
            await this.collectionItemService.list(
              projectId,
              collection.id,
              undefined,
              undefined,
              0,
              0
            )
          ).list;
          collectionItems.forEach((collectionItem) => {
            result.create.push({
              violation: Violation.FIELD_REQUIRED_BUT_UNDEFINED,
              collectionItem,
              fieldDefinition: nextFieldDefinition,
            });
          });
        }
      }
    }

    // Return early to notify the user of changes he has to do before this update is working
    if (
      result.create.length !== 0 ||
      result.update.length !== 0 ||
      result.delete.length !== 0
    ) {
      this.logService.info(
        'Collection update contains unresolved issues',
        { currentCollection, nextCollection: collection },
        projectId
      );
      return result;
    }

    await this.jsonFileService.update(collection, collectionConfigPath);
    await this.gitService.add(projectPath, [collectionConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.update);

    this.logService.info(
      'Updated Collection',
      { currentCollection, nextCollection: collection },
      projectId
    );
  }

  /**
   * Deletes given Collection (folder), including it's items
   *
   * The Fields that Collection used are not deleted.
   *
   * @param projectId Project ID of the Collection to delete
   * @param id        ID of the Collection to delete
   */
  public async delete(projectId: string, id: string): Promise<void> {
    this.logService.debug(
      'Recieved request to delete Collection',
      { id },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const collectionPath = Util.pathTo.collection(projectId, id);
    await Fs.remove(collectionPath);
    await this.gitService.add(projectPath, [collectionPath]);
    await this.gitService.commit(projectPath, this.gitMessage.delete);

    this.logService.info('Deleted Collection', { id }, projectId);
  }

  public async list(
    projectId: string,
    sort: Sort<Collection>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<Collection>> {
    this.logService.debug(
      'Recieved request to list Collections',
      { sort, filter, limit, offset },
      projectId
    );

    const modelReferences = await this.listReferences(
      ModelType.COLLECTION,
      projectId
    );
    const list = await Util.returnResolved(
      modelReferences.map((modelReference) => {
        return this.read(projectId, modelReference.id);
      })
    );

    const paginatedResult = this.paginate(list, sort, filter, limit, offset);

    this.logService.debug(
      'Listed Collections',
      { sort, filter, limit, offset, paginatedResult },
      projectId
    );

    return paginatedResult;
  }

  public async count(projectId: string): Promise<number> {
    this.logService.debug(
      'Recieved request to count Collections',
      {},
      projectId
    );

    const count = (await this.listReferences(ModelType.COLLECTION, projectId))
      .length;

    this.logService.debug('Counted Collections', { count }, projectId);

    return count;
  }

  /**
   * Checks if given AbstractModel is of type Collection
   *
   * @param model The AbstractModel to check
   */
  public isCollection(model: AbstractModel): model is Collection {
    return model.modelType === ModelType.COLLECTION;
  }

  /**
   * Creates a Collection from given CollectionConfig
   *
   * @param projectId         The project's ID
   * @param collectionConfig  The CollectionConfig to convert
   */
  private async toCollection(
    projectId: string,
    collectionConfig: CollectionConfig
  ): Promise<Collection> {
    const projectPath = Util.pathTo.project(projectId);
    const collectionConfigPath = Util.pathTo.collectionConfig(
      projectId,
      collectionConfig.id
    );

    const collectionMeta = await this.gitService.getFileCreatedUpdatedMeta(
      projectPath,
      collectionConfigPath
    );
    const collection = new Collection(
      collectionConfig,
      collectionMeta.created,
      collectionMeta.updated
    );

    this.logService.debug(
      'Created new Collection from CollectionConfig',
      { collection, collectionConfig },
      projectId
    );

    return collection;
  }
}
