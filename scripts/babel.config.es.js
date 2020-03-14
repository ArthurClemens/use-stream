import { plugins } from './babel.config.base';

const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        esmodules: true,
      },
    },
  ],
  '@babel/preset-react',
];

module.exports = {
  presets,
  plugins,
};
