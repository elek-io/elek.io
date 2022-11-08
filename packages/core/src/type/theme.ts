import { BlockRestrictions } from './block.js';

export type ThemeLayoutType = 'main' | 'page';

export enum ThemeLayoutElementType {
  IMAGE = 'image',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
}

export interface ThemeLayout {
  id: string;
  type: ThemeLayoutType;
  name: string;
  description: string;
  path: string;
}

export interface ThemeLayoutBlockPosition {
  id: string;
  restrictions: BlockRestrictions;
}

export interface ThemeLayoutElementPosition {
  id: string;
  type: ThemeLayoutElementType;
}
