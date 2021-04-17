import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

const { env } = process;
const pkg = JSON.parse(fs.readFileSync('./package.json').toString());

const isModule = !!parseInt(env.MODULE || '', 10);
const format = isModule ? 'es' : 'umd';
const target = isModule ? 'ESNEXT' : 'es2015';
const file = isModule
  ? `${process.env.DEST || pkg.module}`
  : `${process.env.DEST || pkg.main}.js`;

export default {
  input: 'src/index.ts',
  output: {
    name: env.MODULE_NAME,
    format,
    file,
    sourcemap: !isModule,
  },
  plugins: [
    typescript({
      target,
    }),
    cleanup({
      comments: 'none',
    }),
    !isModule && terser(),
  ],
};
