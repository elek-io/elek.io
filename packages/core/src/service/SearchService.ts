import { ElekIoCoreOptions } from '../type/general.js';
import { ModelType } from '../type/model.js';
import { SearchResult } from '../type/search.js';
import { ServiceType } from '../type/service.js';
import Project from '../model/Project.js';
import AbstractService from './AbstractService.js';
import AssetService from './AssetService.js';
import CollectionService from './CollectionService.js';
import EventService from './EventService.js';

/**
 * Service that manages CRUD functionality for page files on disk
 *
 * @todo refactor for the new Services
 */
export default class SearchService extends AbstractService {
  private assetService: AssetService;
  private collectionService: CollectionService;

  constructor(
    options: ElekIoCoreOptions,
    assetService: AssetService,
    collectionService: CollectionService
  ) {
    super(ServiceType.SEARCH, options);

    this.assetService = assetService;
    this.collectionService = collectionService;
  }

  /**
   * Search all models inside the project for given query
   *
   * @todo Implement SearchOptions parameter
   *
   * @param project Project to search in
   * @param query Query to search for
   */
  public async search(projectId: string, query: string, modelType?: ModelType) {
    const results: SearchResult[] = [];
    const normalizedQuery = query.trim();

    if (normalizedQuery === '') {
      return results;
    }

    const paginatedLists = (
      await Promise.all([
        // this.assetService.list(project, [], normalizedQuery),
        this.collectionService.list(projectId, [], normalizedQuery),
      ])
    ).flat();

    paginatedLists.forEach((paginatedList) => {
      paginatedList.list.flat().forEach((model) => {
        const result: SearchResult = {
          id: model.id,
          language: null, // model.language || null
          name: model.name as string,
          type: model.modelType,
          matches: [],
        };

        for (const [key, value] of Object.entries(model)) {
          const valueString = String(value);
          if (
            valueString.toLowerCase().includes(normalizedQuery.toLowerCase())
          ) {
            const matchStart = valueString
              .toLowerCase()
              .indexOf(normalizedQuery.toLowerCase());
            const matchEnd = matchStart + normalizedQuery.length;

            result.matches.push({
              key,
              prefix: this.truncate(
                valueString.substring(0, matchStart),
                'start'
              ),
              match: valueString.substring(matchStart, matchEnd),
              suffix: this.truncate(
                valueString.substring(matchEnd, valueString.length),
                'end'
              ),
            });
          }
        }

        if (result.matches.length > 0) {
          results.push(result);
        }
      });
    });

    return results;
  }

  private truncate(value: string, at: 'start' | 'end', limit = 15) {
    if (at === 'start') {
      return `${value.substring(value.length - limit, value.length)}`;
    } else {
      return `${value.substring(0, limit)}`;
    }
  }
}
