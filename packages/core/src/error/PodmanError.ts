export default class PodmanError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'PodmanError';
  }
}
