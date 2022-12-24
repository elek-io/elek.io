import { WebpackConfiguration } from '@electron-forge/plugin-webpack/dist/Config';
import { rules } from './webpack.rules';

export const mainConfig: WebpackConfiguration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  node: {
    __dirname: true, // @see https://github.com/desktop/dugite/issues/96#issuecomment-504244621
  },
};
