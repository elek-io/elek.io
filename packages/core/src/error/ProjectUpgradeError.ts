export default class ProjectUpgradeError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ProjectUpgradeError';
  }
}
