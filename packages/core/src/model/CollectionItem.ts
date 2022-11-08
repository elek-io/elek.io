import { CreatedUpdatedMeta } from '../type/model.js';
import CollectionItemConfig from './CollectionItemConfig.js';

/**
 * The CollectionItem contains meta information in addition
 * to the JSON content saved inside it's CollectionItemConfig
 */
export default class CollectionItem
  extends CollectionItemConfig
  implements CreatedUpdatedMeta
{
  public readonly created: number;
  public readonly updated: number;

  constructor(
    collectionItemConfig: CollectionItemConfig,
    created: number,
    updated: number
  ) {
    super(
      collectionItemConfig.id,
      collectionItemConfig.language,
      collectionItemConfig.fieldReferences
    );

    this.created = created;
    this.updated = updated;
  }
}
