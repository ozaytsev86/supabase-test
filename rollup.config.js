import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import del from "rollup-plugin-delete";

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    del({ targets: "dist/*" }),
    json(),
    resolve({
      extensions: [".js", ".jsx"],
      // jsnext: true,
      // main: true,
      browser: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    babel({
      babelHelpers: "runtime",
      presets: ["@babel/env", "@babel/preset-react"],
      exclude: 'node_modules/**'
    }),
    commonjs(),
    serve({
      open: true,
      verbose: true,
      contentBase: ["", "public"],
      host: "localhost",
      port: 3000,
    }),
    livereload({watch: "dist"}),
  ]
};
