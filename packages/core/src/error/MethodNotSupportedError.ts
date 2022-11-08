export default class MethodNotSupportedError extends Error {
  constructor() {
    super();

    this.name = 'MethodNotSupportedError';
  }
}
