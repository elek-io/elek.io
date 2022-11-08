export default class GitError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'GitError';
  }
}
