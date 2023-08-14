/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const plugins = [
    json(),
    commonjs(),
    resolve({ preferBuiltins: true }),
    nodePolyfills({ sourceMap: true }),
];

const pluginsEs = [
    json(),
    babel({
        babelHelpers: 'bundled',
        presets: [
            ['@babel/preset-env'],
        ],
    }),
    commonjs(),
    resolve({ preferBuiltins: true }),
    nodePolyfills({ sourceMap: true }),
];

const umdOutBase = {
    format: 'umd',
    name: 'jsonCompressor',
    exports: 'named',
    sourcemap: 'inline',
};

export default [
    {
        input: './src/index.js',
        plugins,
        output: [
            {
                ...umdOutBase,
                file: './dist/index.js',
            },
            {
                ...umdOutBase,
                file: './dist/index.min.js',
                plugins: [
                    terser({
                        maxWorkers: 8,
                        compress: true,
                    })],
            },
        ],
    },
    {
        input: './src/index.js',
        plugins: pluginsEs,
        output: [
            {
                ...umdOutBase,
                file: './dist/index.es5.js',
            },
            {
                ...umdOutBase,
                file: './dist/index.es5.min.js',
                plugins: [
                    terser({
                        maxWorkers: 8,
                        compress: true,
                    })],
            },
        ],
    },
    {
        input: './src/index.js',
        plugins,
        output: [
            {
                file: './dist/index.esm.mjs',
                format: 'esm',
            },
        ],
    },
];
