export const supportedMimeTypes = [
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'application/pdf',
  'application/zip',
  'video/mp4',
  'video/webm',
  'audio/webm',
  'audio/flac',
] as const;
export type SupportedMimeType = typeof supportedMimeTypes[number];

export const supportedExtensions = [
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'svg',
  'webp',
  'pdf',
  'zip',
  'mp4',
  'webm',
  'flac',
] as const;
export type SupportedExtension = typeof supportedExtensions[number];
