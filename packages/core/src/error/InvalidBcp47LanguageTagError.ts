export default class InvalidBcp47LanguageTagError extends Error {
  constructor(value: string) {
    super(`Provided value "${value}" is not a BCP 47 compliant language tag`);

    this.name = 'InvalidBcp47LanguageTagError';
  }
}
