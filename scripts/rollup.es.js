import { pkg, createConfig } from './rollup.base';

const { env } = process;
const baseConfig = createConfig();
const targetConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    format: 'es',
    file: `${env.DEST || pkg.main}.js`,
  },
};

export default targetConfig;
