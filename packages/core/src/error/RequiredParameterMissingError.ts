export default class RequiredParameterMissingError extends Error {
  constructor(parameter: string) {
    super(`Missing required parameter "${parameter}"`);

    this.name = 'RequiredParameterMissingError';
  }
}
