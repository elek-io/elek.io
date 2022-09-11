import { FieldReference } from '../type/field.js';
import { ModelType } from '../type/model.js';
import AbstractModelWithLanguage from './AbstractModelWithLanguage.js';

/**
 * Represents the JSON file of a CollectionItem saved inside the Collections folder
 */
export default class CollectionItemConfig extends AbstractModelWithLanguage {
  public fieldReferences: FieldReference[];

  constructor(id: string, language: string, fieldReferences: FieldReference[]) {
    super(id, language, ModelType.COLLECTION_ITEM);

    this.fieldReferences = fieldReferences;
  }
}
