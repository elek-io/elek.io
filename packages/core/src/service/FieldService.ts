import { FieldType, FieldValue, ReferenceWithLanguage } from '../type/field.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { ModelType } from '../type/model.js';
import {
  ExtendedCrudService,
  PaginatedList,
  ServiceType,
  Sort,
} from '../type/service.js';
import Fs from 'fs-extra';
import AbstractModel from '../model/AbstractModel.js';
import ProjectConfig from '../model/ProjectConfig.js';
import Util from '../util/index.js';
import AbstractService from './AbstractService.js';
import GitService from './GitService.js';
import JsonFileService from './JsonFileService.js';
import FieldConfig from '../model/FieldConfig.js';
import AssetService from './AssetService.js';
import RequiredParameterMissingError from '../error/RequiredParameterMissingError.js';
import LogService from './LogService.js';
import Field from '../model/Field.js';

/**
 * Service that manages CRUD functionality for Field files on disk
 */
export default class FieldService
  extends AbstractService
  implements ExtendedCrudService<Field>
{
  private logService: LogService;
  private jsonFileService: JsonFileService;
  private gitService: GitService;

  constructor(
    options: ElekIoCoreOptions,
    logService: LogService,
    jsonFileService: JsonFileService,
    gitService: GitService,
    assetService: AssetService
  ) {
    super(ServiceType.FIELD, options);

    this.logService = logService;
    this.jsonFileService = jsonFileService;
    this.gitService = gitService;
  }

  /**
   * Creates a new Field
   *
   * @param projectId Project ID of the Field to create
   * @param language  Language of the Field to create
   * @param fieldType Type of the Field
   * @param value     Value of the Field
   */
  public async create(
    projectId: string,
    language: string,
    fieldType: FieldType,
    value: FieldValue
  ): Promise<Field> {
    this.logService.debug(
      'Recieved request to create Field',
      { language, fieldType, value },
      projectId
    );

    const id = Util.uuid();
    const projectPath = Util.pathTo.project(projectId);
    const fieldConfig = new FieldConfig(id, language, fieldType, value);
    const fieldConfigPath = Util.pathTo.fieldConfig(
      projectId,
      fieldConfig.id,
      language
    );

    this.logService.debug(
      'Created FieldConfig',
      { fieldConfig, fieldConfigPath },
      projectId
    );

    await this.jsonFileService.create(fieldConfig, fieldConfigPath);
    await this.gitService.add(projectPath, [fieldConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.create);

    const field = await this.toField(projectId, fieldConfig);

    this.logService.info('Created Field', { field }, projectId);

    return field;
  }

  /**
   * Returns a Field by ID and language
   *
   * @param projectId Project ID of the Field to read
   * @param id        ID of the Field to read
   * @param language  Language of the Field to read
   */
  public async read(
    projectId: string,
    id: string,
    language: string
  ): Promise<Field> {
    this.logService.debug(
      'Recieved request to read Field',
      { id, language },
      projectId
    );

    const json = await this.jsonFileService.read<FieldConfig>(
      Util.pathTo.fieldConfig(projectId, id, language)
    );

    this.logService.debug('Read FieldConfig from disk', { json }, projectId);

    const fieldConfig = new FieldConfig(
      json.id,
      json.language,
      json.fieldType,
      json.value
    );

    this.logService.debug(
      'Created FieldConfig model',
      { fieldConfig },
      projectId
    );

    return this.toField(projectId, fieldConfig);
  }

  /**
   * Reads and returns all Fields. If references are given,
   * only referenced Fields are read and returned
   *
   * @param projectId   The Project ID to load the Fields from
   * @param references  (Optional) List of Fields to read instead of all
   */
  public async readAll(
    projectId: string,
    references?: ReferenceWithLanguage[]
  ): Promise<Field[]> {
    if (!references) {
      return (await this.list(projectId, undefined, undefined, 0, 0)).list;
    }

    const readPromises = references.map((reference) => {
      return this.read(projectId, reference.id, reference.language);
    });
    return Promise.all(readPromises);
  }

  /**
   * Updates given Field
   *
   * @param projectId Project ID of the Field to update
   * @param field     Field to update
   */
  public async update(projectId: string, field: Field): Promise<void> {
    this.logService.debug(
      'Recieved request to update Field',
      { field },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const fieldConfigPath = Util.pathTo.fieldConfig(
      projectId,
      field.id,
      field.language
    );
    await this.jsonFileService.update(field, fieldConfigPath);
    await this.gitService.add(projectPath, [fieldConfigPath]);
    await this.gitService.commit(projectPath, this.gitMessage.update);

    this.logService.info('Updated Field', { field }, projectId);
  }

  /**
   * Deletes given Field
   *
   * @param projectId Project ID of the Field to delete
   * @param id        ID of the Field to delete
   * @param language  Language of the Field to delete
   */
  public async delete(
    projectId: string,
    id: string,
    language: string
  ): Promise<void> {
    this.logService.debug(
      'Recieved request to delete Field',
      { id, language },
      projectId
    );

    const projectPath = Util.pathTo.project(projectId);
    const fieldPath = Util.pathTo.fieldConfig(projectId, id, language);
    await Fs.remove(fieldPath);
    await this.gitService.add(projectPath, [fieldPath]);
    await this.gitService.commit(projectPath, this.gitMessage.delete);

    this.logService.info('Deleted Field', { id, language }, projectId);
  }

  public async list(
    projectId: string,
    sort: Sort<Field>[] = [],
    filter = '',
    limit = 15,
    offset = 0
  ): Promise<PaginatedList<Field>> {
    this.logService.debug(
      'Recieved request to list Fields',
      { sort, filter, limit, offset },
      projectId
    );

    const modelReferences = await this.listReferences(
      ModelType.FIELD,
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
      'Listed Fields',
      { sort, filter, limit, offset, paginatedResult },
      projectId
    );

    return paginatedResult;
  }

  public async count(projectId: string): Promise<number> {
    this.logService.debug('Recieved request to count Fields', {}, projectId);

    const count = (await this.listReferences(ModelType.FIELD, projectId))
      .length;

    this.logService.debug('Counted Fields', { count }, projectId);

    return count;
  }

  /**
   * Checks if given AbstractModel is of type Field
   *
   * @param model The AbstractModel to check
   */
  public isField(model: AbstractModel): model is Field {
    return model.modelType === ModelType.FIELD;
  }

  /**
   * Creates a Field from given FieldConfig
   *
   * @param projectId   The project's ID
   * @param fieldConfig The FieldConfig to convert
   */
  private async toField(
    projectId: string,
    fieldConfig: FieldConfig
  ): Promise<Field> {
    const projectPath = Util.pathTo.project(projectId);
    const fieldConfigPath = Util.pathTo.fieldConfig(
      projectId,
      fieldConfig.id,
      fieldConfig.language
    );

    const fieldConfigMeta = await this.gitService.getFileCreatedUpdatedMeta(
      projectPath,
      fieldConfigPath
    );
    const field = new Field(
      fieldConfig,
      fieldConfigMeta.created,
      fieldConfigMeta.updated
    );

    this.logService.debug(
      'Created new Field from FieldConfig',
      { field, fieldConfig },
      projectId
    );

    return field;
  }
}
