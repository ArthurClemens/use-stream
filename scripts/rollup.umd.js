/*
Build to an Universal Module Definition
*/
// eslint-disable-next-line import/no-extraneous-dependencies
import { terser } from 'rollup-plugin-terser';
import { pkg, createConfig } from './rollup.base';

const { env } = process;
const name = env.MODULE_NAME || 'useStream';

const baseConfig = createConfig();
const targetConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    name,
    format: 'umd',
    file: `${env.DEST || pkg.main}.min.js`,
    sourcemap: false,
  },
};
targetConfig.plugins.push(terser());

export default targetConfig;
