import { JsonOf } from './general.js';

export interface MdFileContent<T> {
  jsonHeader: JsonOf<T>;
  mdBody: string;
}
