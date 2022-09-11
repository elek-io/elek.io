import { ElekIoCoreOptions } from '../type/general.js';
import { ServiceType } from '../type/service.js';
import GenericLogger from '../logger/GenericLogger.js';
import ProjectLogger from '../logger/ProjectLogger.js';
import AbstractService from './AbstractService.js';
import EventService from './EventService.js';

/**
 * Service for writing logs to disk.
 * Provides a generic logger and one specific logger for every project
 *
 * @todo maybe add a success method that uses the EventService
 */
export default class LogService extends AbstractService {
  private readonly eventService: EventService;
  private readonly genericLogger: GenericLogger;
  private readonly projectLoggers: ProjectLogger[] = [];

  constructor(options: ElekIoCoreOptions, eventService: EventService) {
    super(ServiceType.LOG, options);

    this.eventService = eventService;
    this.genericLogger = new GenericLogger(this.options, this.eventService);
  }

  public debug<T extends object>(message: string, obj: T, projectId?: string) {
    this.logger(projectId).debug(obj, message);
  }

  public info<T extends object>(message: string, obj: T, projectId?: string) {
    this.logger(projectId).info(obj, message);
  }

  public warn<T extends object>(message: string, obj: T, projectId?: string) {
    this.logger(projectId).warn(obj, message);
  }

  public error<T extends object>(message: string, obj: T, projectId?: string) {
    this.logger(projectId).error(obj, message);
  }

  public fatal<T extends object>(message: string, obj: T, projectId?: string) {
    this.logger(projectId).fatal(obj, message);
  }

  /**
   * Returns the correct logger to use
   *
   * - If projectId is not given, the GenericLogger is used.
   * - If projectId is given but used the first time, a new ProjectLogger
   * instance is created and used.
   * - If projectId is given and was used before, the existing ProjectLogger
   * instance is used.
   *
   * @param projectId (Optional) ID of the project to log for
   */
  private logger(projectId?: string) {
    if (!projectId) {
      return this.genericLogger;
    }

    // Singleton implementation
    // Tries to find an existing logger for this project first
    const existingProjectLogger = this.projectLoggers.find((projectLogger) => {
      return projectLogger.projectId === projectId;
    });
    if (existingProjectLogger) {
      return existingProjectLogger;
    }

    // And creates a new logger for this project if it's not available already
    const newProjectLogger = new ProjectLogger(
      this.options,
      projectId,
      this.eventService
    );
    this.projectLoggers.push(newProjectLogger);
    return newProjectLogger;
  }
}
