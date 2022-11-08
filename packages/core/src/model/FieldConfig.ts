import { FieldType, FieldValue } from '../type/field.js';
import { ModelType } from '../type/model.js';
import AbstractModelWithLanguage from './AbstractModelWithLanguage.js';

export default class FieldConfig extends AbstractModelWithLanguage {
  public readonly fieldType: FieldType;
  public value: FieldValue;

  constructor(
    id: string,
    language: string,
    fieldType: FieldType,
    value: FieldValue
  ) {
    super(id, language, ModelType.FIELD);

    this.fieldType = fieldType;
    this.value = value;
  }
}
