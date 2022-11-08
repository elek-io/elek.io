export enum CoreEventName {
  ASSET_CREATE = 'asset:create',
  ASSET_READ = 'asset:read',
  ASSET_UPDATE = 'asset:update',
  ASSET_DELETE = 'asset:delete',

  ERROR = 'error',

  FILE_CREATE = 'file:create',
  FILE_READ = 'file:read',
  FILE_UPDATE = 'file:update',
  FILE_DELETE = 'file:delete',

  COLLECTION_CREATE = 'collection:create',
  COLLECTION_READ = 'collection:read',
  COLLECTION_UPDATE = 'collection:update',
  COLLECTION_DELETE = 'collection:delete',

  COLLECTION_ITEM_CREATE = 'collectionItem:create',
  COLLECTION_ITEM_READ = 'collectionItem:read',
  COLLECTION_ITEM_UPDATE = 'collectionItem:update',
  COLLECTION_ITEM_DELETE = 'collectionItem:delete',

  FIELD_CREATE = 'field:create',
  FIELD_READ = 'field:read',
  FIELD_UPDATE = 'field:update',
  FIELD_DELETE = 'field:delete',

  PROJECT_CREATE = 'project:create',
  PROJECT_READ = 'project:read',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',

  SNAPSHOT_CREATE = 'snapshot:create',
  SNAPSHOT_READ = 'snapshot:read',
  SNAPSHOT_LIST = 'snapshot:list',
  SNAPSHOT_REVERT = 'snapshot:revert',
  SNAPSHOT_DELETE = 'snapshot:delete',

  THEME_USE = 'theme:use',
  THEME_READ = 'theme:read',
  THEME_UPDATE = 'theme:update',
  THEME_DELETE = 'theme:delete',
}
