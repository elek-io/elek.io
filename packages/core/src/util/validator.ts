import * as Uuid from 'uuid';
import { SupportedLanguage, supportedLanguages } from '../type/general.js';

const languageTagPattern =
  /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i; // eslint-disable-line max-len

/**
 * Validate a locale string to test if it is BCP 47 compliant
 *
 * Taken from: https://github.com/SafetyCulture/bcp47
 *
 * @param value the language tag to parse
 *
 * @see https://en.wikipedia.org/wiki/IETF_language_tag
 * @see https://tools.ietf.org/html/bcp47
 */
export function isLanguageTag(value: string): boolean {
  return languageTagPattern.test(value);
}

/**
 * Validates a locale string, to see if it contains a supported language tag
 *
 * This method also supports the usage of subtags by splitting and
 * checking only the first part against the list of supported languages.
 * E.g. a value of "de-CH" returns true, because "de" is a supported language tag.
 * To check if it is a valid BCP 47 compliant language tag use isLanguageTag(),
 * since a value of "de-ABCDEFG" would return true with this method.
 *
 * @param value the language tag to check
 */
export function isSupportedLanguageTag(value: string): boolean {
  let languageTag = value;

  // Also support multiple subtags by splitting
  if (value.includes('-') === true) {
    languageTag = value.split('-')[0] as string;
  }

  if (supportedLanguages.includes(languageTag as SupportedLanguage)) {
    return true;
  }
  return false;
}

/**
 * Validates a string to test if it is an UUID v4
 *
 * @param value the string to check
 */
export function isUuid(value: string): boolean {
  if (Uuid.validate(value) && Uuid.version(value) === 4) {
    return true;
  }
  return false;
}
