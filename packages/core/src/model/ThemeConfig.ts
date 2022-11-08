import { ModelType } from '../type/model.js';
import { ThemeLayout } from '../type/theme.js';

/**
 * A theme is the websites structure and design
 * in which content will be injected into
 */
export default class ThemeConfig {
  /**
   * The type of this model
   */
  public readonly type: ModelType = ModelType.THEME;
  public readonly name: string;
  public readonly description: string;
  public readonly version: string;
  public readonly homepage: string;
  public readonly repository: string;
  public readonly author: string;
  public readonly license: string;
  // public readonly navigations = [];
  public readonly layouts: ThemeLayout[];
  // public readonly scripts: {
  //   serve: string;
  //   build: string;
  // };
  public readonly contentFolder = '.elek.io';
  public readonly buildDir = 'dist';

  constructor(
    name: string,
    description: string,
    version: string,
    homepage: string,
    repository: string,
    author: string,
    license: string,
    layouts: ThemeLayout[]
  ) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.homepage = homepage;
    this.repository = repository;
    this.author = author;
    this.license = license;
    this.layouts = layouts;
  }
}
