import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { WebpackConfiguration } from '@electron-forge/plugin-webpack/dist/Config';

rules.push({
  test: /\.css$/,
  use: 'style-loader',
  // why can I not do this anymore?
  // use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: WebpackConfiguration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
