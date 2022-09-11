import { CoreEventName } from '../type/coreEvent.js';
import { ModelType } from '../type/model.js';
import AbstractModel from './AbstractModel.js';
import Project from './Project.js';

/**
 * The CoreEvent is used to inform subscribers (inside and outside)
 * about events that take place inside the core
 */
export default class CoreEvent extends AbstractModel {
  /**
   * Colon separated name describing what the event is about
   *
   * E.g.: "page:create"
   */
  public readonly name: CoreEventName;

  /**
   * The project this event was triggered from
   */
  public readonly project: Project | null;

  /**
   * Additional object all subscribers have access to
   */
  public readonly data: Record<string, unknown> | null;

  constructor(
    id: string,
    name: CoreEventName,
    optional?: { project?: Project; data?: Record<string, unknown> }
  ) {
    super(id, ModelType.EVENT);

    this.name = name;
    this.project = optional?.project || null;
    this.data = optional?.data || null;
  }
}
