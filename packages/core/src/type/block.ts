/**
 * Represents some supported markdown-it rules
 * @see https://github.com/markdown-it/markdown-it#manage-rules
 */
export enum BlockRule {
  HEADING = 'heading',
  TABLE = 'table',
  CODE = 'code',
  BLOCKQUOTE = 'blockquote',
  HR = 'hr',
  LIST = 'list',
  PARAGRAPH = 'paragraph',
  STRIKETHROUGH = 'strikethrough',
  EMPHASIS = 'emphasis',
  LINK = 'link',
  IMAGE = 'image',
}

export interface BlockRestrictions {
  only: BlockRule[];
  not: BlockRule[];
  minimum: number;
  maximum: number;
  required: boolean;
  inline: boolean;
  breaks: boolean;
  html: boolean;
  highlightCode: boolean;
  repeatable: boolean;
}
