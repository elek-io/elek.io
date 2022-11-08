export enum ServiceType {
  LOG = 'log',
  GIT = 'git',
  PROJECT = 'project',
  ASSET = 'asset',
  PAGE = 'page',
  BLOCK = 'block',
  SNAPSHOT = 'snapshot',
  THEME = 'theme',
  EVENT = 'event',
  FILE = 'file',
  JSON_FILE = 'jsonFile',
  MD_FILE = 'mdFile',
  SEARCH = 'search',
  COLLECTION = 'collection',
  COLLECTION_ITEM = 'collectionItem',
  FIELD = 'field',
}

export interface PaginatedList<T> {
  total: number;
  limit: number;
  offset: number;
  list: T[];
}

export interface Sort<T> {
  by: keyof T;
  order: 'asc' | 'desc';
}

export interface PaginationOptions<T> {
  sort: Sort<T>[];
  filter: string;
  limit: number;
  offset: number;
}

/**
 * Implements create, read, update and delete methods
 */
export interface CrudService {
  create: (...args: any) => any;
  read: (...args: any) => any;
  update: (...args: any) => any;
  delete: (...args: any) => any;
}

/**
 * Implements list and count methods additionally
 * to create, read, update and delete
 */
export interface ExtendedCrudService<T> extends CrudService {
  /**
   * Returns a filtered, sorted and paginated list
   * of this services models from given project
   *
   * @see AbstractService.paginate
   *
   * @param project Project to load model from
   * @param sort Array of sort objects containing information about what to sort and how
   * @param filter Filter all object values of `list` by this string
   * @param limit Limit the result to this amount
   * @param offset Start at this index instead of 0
   */
  list: (...args: any) => any; // (project: Project, sort: Sort<T>[], filter: string, limit: number, offset: number) => Promise<PaginatedList<T>>;

  /**
   * Returns the total number of models inside given project
   *
   * @param projectId Project ID to count all assets from
   */
  count: (projectId: string) => Promise<number>;
}
