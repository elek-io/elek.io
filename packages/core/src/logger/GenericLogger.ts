import { ElekIoCoreOptions } from '../type/general.js';
import EventService from '../service/EventService.js';
import Util from '../util/index.js';
import AbstractLogger from './AbstractLogger.js';

/**
 * Logger for logs that are not specific to a project
 */
export default class GenericLogger extends AbstractLogger {
  constructor(options: ElekIoCoreOptions, eventService: EventService) {
    super(options, Util.pathTo.logs, eventService);
  }
}
