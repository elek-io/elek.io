import CollectionItem from '../model/CollectionItem.js';
import { FieldDefinition, FieldReference } from './field.js';
import { Violation } from './violation.js';

export type CollectionUpdateResult = void | {
  create: {
    violation: Violation;
    collectionItem: CollectionItem;
    /**
     * Create a new FieldReference based on this FieldDefinition in above item
     */
    fieldDefinition: FieldDefinition;
  }[];
  update: {
    violation: Violation;
    collectionItem: CollectionItem;
    /**
     * Update this reference in above item
     */
    fieldReference: FieldReference;
  }[];
  delete: {
    violation: Violation;
    collectionItem: CollectionItem;
    /**
     * Delete these references from above item
     */
    references: FieldReference[];
  }[];
};
