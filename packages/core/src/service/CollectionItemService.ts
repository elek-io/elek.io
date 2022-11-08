import { FieldDefinition, FieldReference, FieldType } from '../type/field.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { ModelType } from '../type/model.js';
import { ExtendedCrudService, ServiceType, Sort } from '../type/service.js';
import Fs from 'fs-extra';
import AbstractModel from '../model/AbstractModel.js';
import CollectionConfig from '../model/CollectionConfig.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import GitService from './GitService.js';
import JsonFileService from './JsonFileService.js';
import CollectionItem from '../model/CollectionItem.js';
import FieldConfig from '../model/FieldConfig.js';
import RequiredParameterMissingError from '../error/RequiredParameterMissingError.js';
import LogService from './LogService.js';
import Collection from '../model/Collection.js';
import CollectionItemConfig from '../model/CollectionItemConfig.js';

/**
 * Service that manages CRUD functionality for CollectionItem files on disk
 */
export default class CollectionItemService
  extends AbstractService
  implements ExtendedCrudService<CollectionConfig>
{
  private logService: LogService;
  private jsonFileService: JsonFileService;
  private gitService: GitService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService
  ) {
    super(ServiceType.COLLECTION, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
  }

  /**
   * Creates a new CollectionItem
   *
   * @todo Check if we want to work with Field's directly or load them via ID here
   *
   * @param projectId       Project ID of the CollectionItem to create
   * @param language        Language of the CollectionItem to create
   * @param collection      Collection of the CollectionItem to create
   * @param fields          Fields of the CollectionItem to create
   * @param fieldReferences FieldReferences of the CollectionItem to create
   */
  public async create(
    projectId: string,
    language: string,
    collection: Collection,
    fields: FieldConfig[],
    fieldReferences: FieldReference[]
  ): Promise<CollectionItem> {
    this.logService.debug(
      'Recieved request to create CollectionItem',
      { collection, fields, fieldReferences },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const collectionItemConfig = new CollectionItemConfig(
      Util.uuid(),
      language,
      fieldReferences
    );
    const collectionItemConfigPath = Util.pathTo.collectionItemConfig(
      projectId,
      collection.id,
      collectionItemConfig.id,
      collectionItemConfig.language
    );

    this.logService.debug(
      'Created CollectionItemConfig',
      { collectionItemConfig, collectionItemConfigPath },
      projectId
    );

    this.validateFieldDefinitionsOrThrow(
      collection.fieldDefinitions,
      fields,
      fieldReferences
    );

    await this.jsonFileService.create(
      collectionItemConfig,
      collectionItemConfigPath
    );
    await this.gitService.add(projectPath, [collectionItemConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.create);

    const collectionItem = await this.toCollectionItem(
      projectId,
      collection.id,
      collectionItemConfig
    );

    this.logService.info(
      'Created CollectionItem',
      { collectionItem },
      projectId
    );

    return collectionItem;
  }

  /**
   * Returns a CollectionItem by ID and language
   *
   * @param projectId     Project ID of the CollectionItem to read
   * @param collectionId  ID of the Collection the CollectionItem belongs to
   * @param id            ID of the CollectionItem to read
   * @param language      Language of the CollectionItem to read
   */
  public async read(
    projectId: string,
    collectionId: string,
    id: string,
    language: string
  ): Promise<CollectionItem> {
    this.logService.debug(
      'Recieved request to read CollectionItem',
      { collectionId, id, language },
      projectId
    );

    const json = await this.jsonFileService.read<CollectionItemConfig>(
      Util.pathTo.collectionItemConfig(projectId, collectionId, id, language)
    );

    this.logService.debug(
      'Read CollectionItemConfig from disk',
      { json },
      projectId
    );

    const collectionItemConfig = new CollectionItemConfig(
      json.id,
      json.language,
      json.fieldReferences
    );

    this.logService.debug(
      'Created CollectionItemConfig',
      { collectionItemConfig },
      projectId
    );

    return this.toCollectionItem(projectId, collectionId, collectionItemConfig);
  }

  /**
   * Updates given CollectionItem
   *
   * @param projectId       Project ID of the CollectionItem to update
   * @param collectionId    ID of the Collection of the CollectionItem to update
   * @param collectionItem  CollectionItem to update
   */
  public async update(
    projectId: string,
    collectionId: string,
    collectionItem: CollectionItem
  ): Promise<void> {
    this.logService.debug(
      'Recieved request to update CollectionItem',
      { collectionId, collectionItem },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const collectionItemPath = Util.pathTo.collectionItemConfig(
      projectId,
      collectionId,
      collectionItem.id,
      collectionItem.language
    );
    await this.jsonFileService.update(collectionItem, collectionItemPath);
    await this.gitService.add(projectPath, [collectionItemPath]);
    await this.gitService.commit(projectPath, this.gitMessage.update);

    this.logService.info(
      'Updated CollectionItem',
      { collectionItem },
      projectId
    );
  }

  /**
   * Deletes given CollectionItem
   *
   * @param projectId       Project ID of the CollectionItem to delete
   * @param collectionId    ID of the Collection of the CollectionItem to delete
   * @param id              ID of the CollectionItem to delete
   * @param language        Language of the CollectionItem to delete
   */
  public async delete(
    projectId: string,
    collectionId: string,
    id: string,
    language: string
  ): Promise<void> {
    this.logService.debug(
      'Recieved request to delete CollectionItem',
      { collectionId, id, language },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const collectionItemConfigPath = Util.pathTo.collectionItemConfig(
      projectId,
      collectionId,
      id,
      language
    );
    await Fs.remove(collectionItemConfigPath);
    await this.gitService.add(projectPath, [collectionItemConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.delete);

    this.logService.info(
      'Deleted CollectionItem',
      { collectionId, id, language },
      projectId
    );
  }

  public async list(
    projectId: string,
    collectionId: string,
    sort: Sort<CollectionItem>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ) {
    const modelReferences = await this.listReferences(
      ModelType.COLLECTION_ITEM,
      projectId,
      collectionId
    );
    const list = await Util.returnResolved(
      modelReferences.map((modelReference) => {
        if (!modelReference.language) {
          throw new RequiredParameterMissingError('language');
        }
        return this.read(
          projectId,
          collectionId,
          modelReference.id,
          modelReference.language
        );
      })
    );

    return this.paginate(list, sort, filter, limit, offset);
  }

  public async count(projectId: string): Promise<number> {
    return (await this.listReferences(ModelType.COLLECTION, projectId)).length;
  }

  /**
   * Combines and returns all field references in collection items of given collection.
   * Using the optional fieldDefinitionId, the field references are filtered
   *
   * @param projectId         The project ID of the collection
   * @param collectionId      The collection ID to get all field references from
   * @param fieldDefinitionId The ID of the FieldDefinition that the results are filtered for
   */
  public async getAllFieldReferences(
    projectId: string,
    collectionId: string,
    fieldDefinitionId?: string
  ) {
    const collectionItems = await this.list(
      projectId,
      collectionId,
      undefined,
      undefined,
      0,
      0
    );
    const fieldReferences = collectionItems.list
      .map((collectionItem) => {
        return collectionItem.fieldReferences;
      })
      .flat();
    if (!fieldDefinitionId) {
      return fieldReferences;
    }
    return fieldReferences.filter((fieldReference) => {
      return fieldReference.fieldDefinitionId === fieldDefinitionId;
    });
  }

  /**
   * Checks if given AbstractModel is of type CollectionItem
   *
   * @param model The AbstractModel to check
   */
  public isCollectionItem(model: AbstractModel): model is CollectionItem {
    return model.modelType === ModelType.COLLECTION_ITEM;
  }

  /**
   * Iterates over the field definitions and checks if each referenced field meets it's definition
   *
   * Does not check if the given references or fields are used in the definition.
   * This is done so that the user can decide (displayed in the UI as an unused reference)
   * if he wants to keep the reference or not.
   *
   * @todo maybe use Violation and return instead of throwing, like the CollectionService update method
   *
   * @param fieldDefinitions
   * @param fields
   * @param fieldReferences
   */
  private validateFieldDefinitionsOrThrow(
    fieldDefinitions: FieldDefinition[],
    fields: FieldConfig[],
    fieldReferences: FieldReference[]
  ) {
    fieldDefinitions.forEach((fieldDefinition) => {
      const fieldId = fieldReferences.find((fieldReference) => {
        return fieldReference.fieldDefinitionId === fieldDefinition.id;
      })?.field.id;

      // Definitions that require a field have to refer to a field
      if (fieldDefinition.isRequired === true && !fieldId) {
        throw new Error(
          `No field reference given for required field definition with ID "${fieldDefinition.id}"`
        );
      }

      // If there is a field reference, get the field and check it for errors
      if (fieldId) {
        const field = fields.find((field) => {
          return field.id === fieldId;
        });

        // General checks for all field definitions
        if (!field) {
          throw new Error(
            `No field with ID "${fieldId}" found in given fields`
          );
        }
        if (fieldDefinition.isRequired === true && field.value === null) {
          throw new Error(
            'Required field definition references a field with no value'
          );
        }
        if (fieldDefinition.fieldType !== field.fieldType) {
          // @todo Implement custom error
          throw new Error(
            `Type mismatch between the field definition of type "${fieldDefinition.fieldType}" and the given field type "${field.fieldType}"`
          );
        }
        if (fieldDefinition.isUnique === true) {
          // @todo Implement checking all other CollectionItems of this Collection for having the same value
        }

        // Type specific checks
        switch (fieldDefinition.fieldType) {
          case FieldType.BOOLEAN:
            // None yet
            break;
          case FieldType.NUMBER:
            const number = field.value as number;
            if (fieldDefinition.minimum && number < fieldDefinition.minimum) {
              throw new Error(
                "Fields value is less than the minimum of it's definition"
              );
            }
            if (fieldDefinition.maximum && number > fieldDefinition.maximum) {
              throw new Error(
                "Fields value is more than the maximum of it's definition"
              );
            }
            if (
              fieldDefinition.isFloat === false &&
              Number.isInteger(number) === false
            ) {
              throw new Error(
                "Fields value is not an integer but required to be one by it's definition"
              );
            }
            break;
          case FieldType.STRING:
            const string = field.value as string;
            if (
              fieldDefinition.minimum &&
              string.length < fieldDefinition.minimum
            ) {
              throw new Error(
                "Fields value is less than the minimum of it's definition"
              );
            }
            if (
              fieldDefinition.maximum &&
              string.length > fieldDefinition.maximum
            ) {
              throw new Error(
                "Fields value is more than the maximum of it's definition"
              );
            }
            break;
        }
      }
    });
  }

  /**
   * Creates a CollectionItem from given CollectionItemConfig
   *
   * @param collectionItemConfig  The CollectionItemConfig to convert
   * @param collection            The Collection of this CollectionItemConfig
   * @param projectId             The Project's ID
   */
  private async toCollectionItem(
    projectId: string,
    collectionId: string,
    collectionItemConfig: CollectionItemConfig
  ) {
    const projectPath = Util.pathTo.project(projectId);
    const collectionItemConfigPath = Util.pathTo.collectionItemConfig(
      projectId,
      collectionId,
      collectionItemConfig.id,
      collectionItemConfig.language
    );

    const collectionItemMeta = await this.gitService.getFileCreatedUpdatedMeta(
      projectPath,
      collectionItemConfigPath
    );
    const collectionItem = new CollectionItem(
      collectionItemConfig,
      collectionItemMeta.created,
      collectionItemMeta.updated
    );

    this.logService.debug(
      'Created CollectionItem from CollectionItemConfig',
      { collectionItem, collectionItemConfig },
      projectId
    );

    return collectionItem;
  }
}
