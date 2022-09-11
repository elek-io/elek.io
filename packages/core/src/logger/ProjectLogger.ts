import { ElekIoCoreOptions } from '../type/general.js';
import EventService from '../service/EventService.js';
import Util from '../util/index.js';
import AbstractLogger from './AbstractLogger.js';

/**
 * Logger for logs that are specific to a project
 */
export default class ProjectLogger extends AbstractLogger {
  public readonly projectId: string;

  constructor(
    options: ElekIoCoreOptions,
    projectId: string,
    eventService: EventService
  ) {
    super(options, Util.pathTo.projectLogs(projectId), eventService);

    this.projectId = projectId;
  }
}
