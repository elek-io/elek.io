import AbstractModel from '../model/AbstractModel.js';

export enum Violation {
  FIELD_REQUIRED_BUT_UNDEFINED = 'violation.field.required_but_undefined',
  FIELD_VALUE_REQUIRED_BUT_NULL = 'violation.field_value.required_but_null',
  FIELD_VALUE_NOT_UNIQUE = 'violation.field_value.not_unique',
}
