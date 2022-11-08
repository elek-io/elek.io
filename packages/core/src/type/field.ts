import AbstractModel from '../model/AbstractModel.js';
import { SupportedExtension, SupportedMimeType } from './asset.js';
import { TranslatableString } from './general.js';
import { MarkdownRestrictions } from './markdown.js';
import { ModelReference, ModelType } from './model.js';
import { ServiceType } from './service.js';
import { Violation } from './violation.js';

export enum FieldType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
  ASSET = 'asset',
  LIST = 'list',
  REFERENCE = 'reference',
  SLUG = 'slug',
}

export const supportedFieldInputWidths = [12, 6, 4, 3] as const;
export type FieldInputWidth = typeof supportedFieldInputWidths[number];

/**
 * The input type determines how the user inputs data
 *
 * For example, a field that contains a numeric timestamp
 * could be displayed as of type number, but it's probably
 * more usable if used with the display type date.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types
 */
export enum FieldInputType {
  LIST = 'list',
  REFERENCE = 'reference',
  MARKDOWN = 'markdown',
  SELECT = 'select',
  CHECKBOX = 'checkbox', //
  RANGE = 'range', //
  COLOR = 'color', //
  DATE = 'date', //
  TIME = 'time', //
  /**
   * Uses datetime-local, since datetime is deprecated
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime
   */
  DATETIME = 'datetime', //
  EMAIL = 'email', //
  NUMBER = 'number', //
  PASSWORD = 'password', //
  RADIO = 'radio', //
  TELEPHONE = 'telephone', //
  TEXT = 'text', //
  TEXTAREA = 'textarea', //
  FILE = 'file',
}

/**
 * Information on how the field should be displayed
 *
 * @todo maybe in the future we can extend this to also include
 * the component used to render the "input field"
 *
 * @see https://docs.directus.io/guides/interfaces/
 * @see https://docs.directus.io/concepts/interfaces/
 */
export interface FieldInputBase {
  /**
   * Defines how much width (out of 12 total) this field will take up horizontally
   * e.g.:
   *
   * |||||
   * |:-:|:-:|:-:|:-:|
   * | 3 | 3 | 3 | 3 |
   * | 4  |  4  |  4 |
   * |   6   |   6   |
   * |      12       |
   */
  width: FieldInputWidth;
  inputType: FieldInputType;
  isDisabled: boolean;
  isReadonly: boolean;
}

export interface FieldInputReference extends FieldInputBase {
  inputType: FieldInputType.REFERENCE;
}

export interface FieldInputText extends FieldInputBase {
  inputType: FieldInputType.TEXT;
}

export interface FieldInputTextarea extends FieldInputBase {
  inputType: FieldInputType.TEXTAREA;
}

export interface FieldInputMarkdown extends FieldInputBase {
  inputType: FieldInputType.MARKDOWN;
  restrictions: MarkdownRestrictions;
}

export interface FieldInputSelect extends FieldInputBase {
  inputType: FieldInputType.SELECT;
  options: {
    name: TranslatableString;
    value: any;
    isDisabled: boolean;
  }[];
}

export interface FieldInputCheckbox extends FieldInputBase {
  inputType: FieldInputType.CHECKBOX;
  isChecked: boolean;
}

export interface FieldInputFile extends FieldInputBase {
  inputType: FieldInputType.FILE;
}

export interface FieldInputList extends FieldInputBase {
  inputType: FieldInputType.LIST;
}

export type FieldInput =
  | FieldInputReference
  | FieldInputList
  | FieldInputSelect
  | FieldInputText
  | FieldInputTextarea
  | FieldInputFile
  | FieldInputCheckbox
  | FieldInputMarkdown;

/**
 * @todo have a closer look to https://mongoosejs.com/docs/schematypes.html
 * and https://www.sanity.io/ in general
 */
export interface FieldDefinitionBase {
  /**
   * UUID (?) that is potentially set by the used theme (external and therefore to use with caution)
   * and used to map between the field definition and fields
   */
  readonly id: string;
  /**
   * A name shown to the user on what this field is about
   */
  name: TranslatableString;
  /**
   * A description shown to the user on how to use this field
   */
  description: TranslatableString;
  /**
   * Depending on this type, field definitions can contain different additional values
   */
  readonly fieldType: FieldType;
  /**
   * Information on how this field should be displayed
   */
  input: FieldInput;
  /**
   * A required field has to have a value (not null)
   *
   * Trimmed empty strings are considered to be null.
   */
  isRequired: boolean;
  /**
   * A unique fields value can only exist once in a collection
   */
  isUnique: boolean;
  /**
   * If true, the user can't modify the value because the core does it automatically
   */
  readonly isManagedByCore: boolean;
  /**
   * A regular expression that defines a pattern the entered data needs to follow
   */
  readonly pattern?: RegExp;
}

export interface BooleanFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.BOOLEAN;
  initial: boolean | null;
  input: FieldInputCheckbox;
}

export interface NumberFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.NUMBER;
  initial: number | null;
  minimum: number | null;
  maximum: number | null;
  isFloat: boolean;
}

export interface StringFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.STRING;
  initial: string | null;
  minimum: number | null;
  maximum: number | null;
  input: FieldInputText | FieldInputSelect; // Add to this when more FieldInputs are defined
}

export interface AssetFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.ASSET;
  extensions: SupportedExtension[];
  mimeTypes: SupportedMimeType[];
  input: FieldInputFile;
}

export interface ReferenceFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.REFERENCE;
  modelType: ModelType.COLLECTION_ITEM | ModelType.ASSET;
  input: FieldInputReference;
}

export interface ListFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.LIST;
  fieldDefinitions: FieldDefinition[];
  input: FieldInputList;
  minimum: number | null;
  maximum: number | null;
}

export interface SlugFieldDefinition extends FieldDefinitionBase {
  fieldType: FieldType.SLUG;
  /**
   * FieldDefinition ID to generate a slug from it's value
   */
  from: string;
  isManagedByCore: true;
  isUnique: true;
}

export type FieldDefinition =
  | NumberFieldDefinition
  | StringFieldDefinition
  | BooleanFieldDefinition
  | AssetFieldDefinition
  | ListFieldDefinition
  | ReferenceFieldDefinition
  | SlugFieldDefinition;

export interface Reference {
  modelType: ModelType;
  id: string;
}

export interface ReferenceWithLanguage extends Reference {
  language: string;
}

export interface FieldValueAsset {
  name: string;
  description: string;
  extension: SupportedExtension;
  mimeType: SupportedMimeType;
}

export type FieldValue =
  | boolean
  | number
  | string
  | ReferenceWithLanguage
  | null;

export type FieldReference = {
  fieldDefinitionId: string;
  field: {
    id: string;
    language: string;
  };
};

// /**
//  * A field with number value
//  */
// export interface NumberField extends Field {
//   type: FieldType.NUMBER;
//   isManagedByCore: false;
//   isFloat: boolean;
//   minimum: number;
//   maximum: number;
//   default: number;
//   value: number;
// }

// /**
//  * A field with string value
//  */
// export interface StringField extends Field {
//   type: FieldType.STRING;
//   isManagedByCore: false;
//   /**
//    * One row renders a input field, two or more a textarea
//    */
//   rows: number;
//   minimum: number;
//   maximum: number;
//   default: string;
//   value: string;
// }

// /**
//  * A field with boolean value
//  *
//  * Always required to select true or false,
//  * since null is not a valid boolean.
//  */
// export interface BooleanField extends Field {
//   type: FieldType.BOOLEAN;
//   isManagedByCore: false;
//   required: true;
//   default: boolean;
//   value: boolean;
// }
