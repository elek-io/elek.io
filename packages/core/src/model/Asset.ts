import { CreatedUpdatedMeta } from '../type/model.js';
import AssetConfig from './AssetConfig.js';

/**
 * The Asset class extending AssetConfig class represents an external file like image, PDF or ZIP.
 * In addition to the AssetConfig's saved file content, the Asset contains meta information about that file,
 * like EXIF, dimensions and the absolute path to it.
 */
export default class Asset extends AssetConfig implements CreatedUpdatedMeta {
  public readonly created: number;
  public readonly updated: number;

  /**
   * Absolute path on this filesystem
   */
  public readonly absolutePath: string;

  /**
   * Total size in bytes
   */
  public readonly size: number;

  constructor(
    assetConfig: AssetConfig,
    created: number,
    updated: number,
    absolutePath: string,
    size: number
  ) {
    super(
      assetConfig.id,
      assetConfig.language,
      assetConfig.name,
      assetConfig.description,
      assetConfig.extension,
      assetConfig.mimeType
    );

    this.created = created;
    this.updated = updated;
    this.absolutePath = absolutePath;
    this.size = size;
  }
}
