import { ModelType } from '../type/model.js';
import { PageContentReference, PageStatus } from '../type/page.js';
import AbstractModelWithLanguage from './AbstractModelWithLanguage.js';

/**
 * The page represents a uniquely identifiable site of a website
 * that is available via an URL
 */
export default class Page extends AbstractModelWithLanguage {
  public name: string;

  public status: PageStatus = PageStatus.PRIVATE;

  /**
   * URI path this page will be available from when deployed
   *
   * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
   */
  public uriPath: string;

  /**
   * Layout ID of the theme the project uses
   */
  public layoutId: string;

  public content: PageContentReference[] = [];

  constructor(
    id: string,
    language: string,
    name: string,
    uriPath: string,
    layoutId: string,
    content: PageContentReference[]
  ) {
    super(id, language, ModelType.PAGE);

    this.name = name;
    this.uriPath = uriPath;
    this.layoutId = layoutId;
    this.content = content;
  }
}
