import { ModelType } from '../type/model.js';
import AbstractModelWithLanguage from './AbstractModelWithLanguage.js';

/**
 * The block represents some kind of Markdown content inside a page.
 * It needs a position inside the pages layout to be injected in and
 * contains multiple HTML elements like paragraphs, images and tables.
 * The used theme dictates what elements can be used in given block's position
 */
export default class Block extends AbstractModelWithLanguage {
  public name: string;
  public body = '';

  constructor(id: string, language: string, name: string, body: string) {
    super(id, language, ModelType.BLOCK);

    this.name = name;
    this.body = body;
  }
}
