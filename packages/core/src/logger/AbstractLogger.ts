import Path from 'path';
import Pino from 'pino';
import PinoPretty from 'pino-pretty';
import { CoreEventName } from '../type/coreEvent.js';
import { ElekIoCoreOptions, Environment } from '../type/general.js';
import EventService from '../service/EventService.js';

export default abstract class AbstractLogger {
  public readonly options: ElekIoCoreOptions;
  public readonly debug: Pino.LogFn;
  public readonly info: Pino.LogFn;
  public readonly warn: Pino.LogFn;
  public readonly error: Pino.LogFn;
  public readonly fatal: Pino.LogFn;
  private readonly logger: Pino.Logger;
  private readonly eventService: EventService;

  protected constructor(
    options: ElekIoCoreOptions,
    filePath: string,
    eventService: EventService
  ) {
    this.options = options;
    this.eventService = eventService;

    const logLevel = this.options.log.level;
    const destination = Pino.destination(Path.join(filePath, 'core.log'));

    switch (process.env.NODE_ENV) {
      case Environment.PRODUCTION:
        // Use Pino without multistream for enhanced performance
        // and only log to file while in production
        this.logger = Pino({ level: logLevel }, destination);

        // this.registerEmergencyFlush();
        break;
      default:
        // Use Pino with multistream to show pretty console output
        // while developing and debugging
        this.logger = Pino(
          { level: logLevel },
          Pino.multistream([
            { stream: destination },
            { stream: PinoPretty() },
          ])
        );

        // this.registerEmergencyFlush();
        break;
    }

    this.debug = this.logger.debug.bind(this.logger);
    this.info = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.fatal = this.logger.fatal.bind(this.logger);
  }

  /**
   * Reliably flush every log line in case of unexpected crashes to prevent loosing logs.
   * Also emits an event to spread the bad news
   *
   * @see http://getpino.io/#/docs/help?id=exit-logging
   */
  // private registerEmergencyFlush() {
  //   ['uncaughtException', 'unhandledRejection'].forEach((errorToHandle) => {
  //     process.on(
  //       errorToHandle,
  //       Pino.pino(this.logger, (err, finalLogger) => {
  //         finalLogger.error(err, errorToHandle);
  //         this.eventService.emit(CoreEventName.ERROR, {
  //           data: {
  //             error: err,
  //             message: errorToHandle,
  //           },
  //         });
  //       })
  //     );
  //   });
  // }
}
