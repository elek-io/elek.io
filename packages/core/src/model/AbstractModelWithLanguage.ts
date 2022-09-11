import { ModelType } from '../type/model.js';
import InvalidBcp47LanguageTagError from '../error/InvalidBcp47LanguageTagError.js';
import UnsupportedLanguageTagError from '../error/UnsupportedLanguageTagError.js';
import Util from '../util/index.js';
import AbstractModel from './AbstractModel.js';

/**
 * A model extending this, is only uniquely identifiable
 * by it's ID in conjunction with it's language.
 *
 * This is because we save them with a name of
 * the following convention: ${uuid}.${language-code}.${extension}.
 *
 * @example
 * '9cb0bace-d4a7-47d2-a163-1bc4e8b6dad6.en-US.json'
 */
export default abstract class AbstractModelWithLanguage extends AbstractModel {
  /**
   * BCP 47 compliant, supported language tag
   *
   * @see https://en.wikipedia.org/wiki/IETF_language_tag
   * @see https://tools.ietf.org/html/bcp47
   */
  public readonly language: string;

  protected constructor(id: string, language: string, type: ModelType) {
    super(id, type);

    if (Util.validator.isLanguageTag(language) === false) {
      throw new InvalidBcp47LanguageTagError(language);
    }
    if (Util.validator.isSupportedLanguageTag(language) === false) {
      throw new UnsupportedLanguageTagError(language);
    }
    this.language = language;
  }
}
