import pino from 'pino';
import { GitSignature } from './git.js';

/**
 * Defines that one or more keys (K) of type (T) are optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * Custom JSON type to be more specific about what we expect
 * and do not need to use the any type that would generate warnings
 *
 * @see https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

/**
 * Since we read and write a lot of JSON,
 * we want to be more specific about what we are currently working with.
 *
 * For example:
 * If we instanciate a new page, e.g. new Page(xyz), we are able to call methods of this class.
 * If we then save (serialize) this class as JSON on disk and after that read (parse) it again,
 * we are not able to call methods of the class since we are now working
 * with a plain (literal) object that only has the same properties of the class before.
 *
 * This type is showing us exactly that we are only working with the JSON representation
 * of the class, not the class itself. Which is also way better then working
 * with the default any type JSON.parse() is returning.
 *
 * @see https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081
 */
export type JsonOf<T> = {
  [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : T[P] extends (() => any) | undefined
    ? never
    : JsonOf<T[P]>;
};

/**
 * Options that can be passed to elek.io core
 */
export interface ElekIoCoreOptions {
  signature: GitSignature;
  locale: Locale;
  file: {
    json: {
      /**
       * If set, adds indentation with spaces (number) or escape character (string)
       * and line break characters to saved JSON files on disk, to make them easier to read.
       * Defaults to 2 spaces of indentation.
       */
      indentation?: number | string;
    };
  };
  log: {
    /**
     * Setting a supported log level
     *
     * @see https://github.com/pinojs/pino/blob/master/docs/api.md#levels
     */
    level: pino.LoggerOptions['level'];
  };
}

export interface Locale {
  /**
   * BCP 47 compliant, unique language tag
   */
  id: string;
  /**
   * Display name
   */
  name: string;
}

/**
 * All currently supported, BCP 47 compliant language tags
 *
 * The support depends on the tools and libraries we use.
 * We can't support a given language, if there is no support
 * for it from used third parties. Currently, to check if a langauge
 * tag can be added to this list, it needs to be supported by:
 * - DeepL translation API
 *
 * @see https://www.deepl.com/docs-api/other-functions/listing-supported-languages/
 */
export const supportedLanguages = [
  'bg', // Bulgarian
  'cs', // Czech
  'da', // Danish
  'de', // German
  'el', // Greek
  'en', // (US) English
  'es', // Spanish
  'et', // Estonian
  'fi', // Finnish
  'fr', // French
  'hu', // Hungarian
  'it', // Italian
  'ja', // Japanese
  'lt', // Lithuanian
  'lv', // Latvian
  'nl', // Dutch
  'pl', // Polish
  'pt', // Portuguese
  'ro', // Romanian
  'ru', // Russian
  'sk', // Slovak
  'sl', // Slovenian
  'sv', // Swedish
  'zh', // (Simplified) Chinese
] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

/**
 * A string based value that can be translated into all supported languages
 *
 * If a supported translation is not available,
 * it should show the default language of the project.
 * If this is not available either, show the 'en' value.
 * If this is also not available, show the key instead along with a note,
 * that a translation should be added.
 */
export type TranslatableString = Partial<Record<SupportedLanguage, string>>;

export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}
