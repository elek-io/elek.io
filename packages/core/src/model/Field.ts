import { CreatedUpdatedMeta } from '../type/model.js';
import FieldConfig from './FieldConfig.js';

export default class Field extends FieldConfig implements CreatedUpdatedMeta {
  public readonly created: number;
  public readonly updated: number;

  constructor(fieldConfig: FieldConfig, created: number, updated: number) {
    super(
      fieldConfig.id,
      fieldConfig.language,
      fieldConfig.fieldType,
      fieldConfig.value
    );

    this.created = created;
    this.updated = updated;
  }
}
