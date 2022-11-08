import { CreatedUpdatedMeta } from '../type/model.js';
import CollectionConfig from './CollectionConfig.js';

/**
 * The Collection contains meta information in addition
 * to the JSON content saved inside it's CollectionConfig
 */
export default class Collection
  extends CollectionConfig
  implements CreatedUpdatedMeta
{
  public readonly created: number;
  public readonly updated: number;

  constructor(
    collectionConfig: CollectionConfig,
    created: number,
    updated: number
  ) {
    super(
      collectionConfig.id,
      collectionConfig.name,
      collectionConfig.description,
      collectionConfig.icon,
      collectionConfig.fieldDefinitions
    );

    this.created = created;
    this.updated = updated;
  }
}
