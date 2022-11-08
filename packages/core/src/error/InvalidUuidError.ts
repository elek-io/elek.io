export default class InvalidUuidError extends Error {
  constructor(value: string) {
    super(`Provided value "${value}" is not a UUID v4 compliant ID`);

    this.name = 'InvalidUuidError';
  }
}
