import { FieldDefinition } from '../type/field.js';
import { TranslatableString } from '../type/general.js';
import { ModelType } from '../type/model.js';
import AbstractModel from './AbstractModel.js';

/**
 * Represents the JSON file of a Collection saved inside the Collections folder
 */
export default class CollectionConfig extends AbstractModel {
  public key: string | undefined;
  public name: TranslatableString;
  public description: TranslatableString;
  public icon: string;

  /**
   * Definitions of fields used for this collection
   */
  public fieldDefinitions: FieldDefinition[] = [];

  constructor(
    id: string,
    name: TranslatableString,
    description: TranslatableString,
    icon: string,
    fieldDefinitions: FieldDefinition[],
    key?: string
  ) {
    super(id, ModelType.COLLECTION);

    this.key = key;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.fieldDefinitions = fieldDefinitions;
  }
}
