import AbstractModel from '../model/AbstractModel.js';
import { SupportedLanguage } from './general.js';

export enum ModelType {
  COLLECTION = 'collection',
  COLLECTION_ITEM = 'collectionItem',
  FIELD = 'field',
  PROJECT = 'project',
  EVENT = 'event',
  ASSET = 'asset',
  PAGE = 'page',
  BLOCK = 'block',
  SNAPSHOT = 'snapshot',
  THEME = 'theme',
}

/**
 * Unique reference to a file of a model on disk
 */
export interface ModelReference {
  id: string;
  language: string | null;
  extension: string | null;
}

/**
 * Adds created and updated timestamp meta information
 */
export interface CreatedUpdatedMeta {
  /**
   * Timestamp of this model's creation
   */
  created: number;
  /**
   * Timestamp of this model's last modification
   */
  updated: number;
}
