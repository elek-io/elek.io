export default class FileTypeNotSupportedError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'FileTypeNotSupportedError';
  }
}
