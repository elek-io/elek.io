export default class UnsupportedLanguageTagError extends Error {
  constructor(value: string) {
    super(`Provided value "${value}" is not a supported language tag`);

    this.name = 'UnsupportedLanguageTagError';
  }
}
