import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import fs from "fs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const env = process.env;
const pkg = JSON.parse(fs.readFileSync("./package.json"));
const production = !process.env.ROLLUP_WATCH;
const isModule = !!process.env.MODULE;
const isTypeScript = !!process.env.TYPESCRIPT;
const format = isModule
  ? "es"
  : "umd";
const file = isModule
  ? `${process.env.DEST || pkg.main}.mjs`
  : `${process.env.DEST || pkg.main}.js`;

export default {
  input: env.ENTRY || "src/index.ts",
  output: {
    sourcemap: true,
    format,
    name: pkg.name,
    file
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    isTypeScript && typescript({
      abortOnError: false
    }),
    production && !isModule && terser()
  ]
};