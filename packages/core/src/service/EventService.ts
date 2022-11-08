import { Subject, Subscription } from 'rxjs';
import { CoreEventName } from '../type/coreEvent.js';
import { ElekIoCoreOptions } from '../type/general.js';
import { ServiceType } from '../type/service.js';
import CoreEvent from '../model/CoreEvent.js';
import Project from '../model/Project.js';
import AbstractService from './AbstractService.js';
import Util from '../util/index.js';

/**
 * Service that manages subscribing and emitting events between
 * different services and outside applications like the elek.io client
 */
export default class EventService extends AbstractService {
  private readonly eventSubject = new Subject<CoreEvent>();

  constructor(options: ElekIoCoreOptions) {
    super(ServiceType.EVENT, options);
  }

  /**
   * Subscribes to all events
   *
   * @todo Should improve is a lot once we know what we need
   */
  public get on() {
    return this.eventSubject.subscribe.bind(this.eventSubject);
  }

  /**
   * Emits a new CoreEvent to all it's subscribers
   *
   * @param name Colon separated name describing what the event is about. E.g.: "page:create"
   * @param optional Optional object containing the project this event was triggered from and an additional object all subscribers have access to
   */
  public emit(
    name: CoreEventName,
    optional?: { project?: Project; data?: Record<string, unknown> }
  ): void {
    const id = Util.uuid();
    const event = new CoreEvent(id, name, optional);

    this.eventSubject.next(event);
  }
}
