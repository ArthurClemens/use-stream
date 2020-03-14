/* eslint-disable import/no-extraneous-dependencies */
import fs from "fs";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

const {env} = process;
export const pkg = JSON.parse(fs.readFileSync("./package.json"));
const external = Object.keys({
  ...pkg.devDependencies,
  ...pkg.peerDependencies
});

const name = env.MODULE_NAME;
const isTypeScript = !!process.env.TYPESCRIPT;

const globals = {};
globals.mithril = "m";
globals.react = "React";

external.forEach(ext => {
  globals[ext] = ext;
});

export const createConfig = () => {
  const config = {
    input: env.ENTRY || "lib/index.ts",
    external,
    output: {
      name,
      globals,
    },
    plugins: [
      
      resolve({ browser: true }),

      commonjs(),

      isTypeScript && typescript({
        abortOnError: false
      }),

      !isTypeScript && babel({
        exclude: "node_modules/**",
        configFile: "./babel.config.js"
      })

    ]
  };
  
  return config;
};
