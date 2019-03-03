const path = require('path');

import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import merge from 'lodash.merge';
import pkg from './package.json';
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve';
import url from "rollup-plugin-url";

import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';

const entryFile = path.resolve(__dirname, 'src', 'index.js');
const outputFile = path.resolve(__dirname, 'dist', `${pkg.name}.js`);

// Banner
const bannerData = [
    `${pkg.name}`,
    `v${pkg.version}`,
    `${pkg.homepage}`,
    `(c) ${(new Date()).getFullYear()} ${pkg.author}`,
    `${pkg.license} license`
];

// Plugins
const pluginSettings = {
    eslint: {
        exclude: ['node_modules/**', './package.json', '**/*.css'],
        throwOnWarning: false,
        throwOnError: true
    },
    babel: {
        exclude: ['node_modules/**'],
        presets: [
            ['@babel/preset-env', {
                modules: false,
                targets: {
                    browsers: ['ie >= 9']
                }
            }]
        ]
    },
    postcss: {
        minimize: true,
        plugins: [
            autoprefixer()
        ]
    },
    url :{
        limit: 10 * 1024, // inline files < 10k, copy files > 10k
        include: ["**/*.svg"], // defaults to .svg, .png, .jpg and .gif files
        emitFiles: true // defaults to true
    },
    uglify: {
        beautify: {
            compress: false,
            mangle: false,
            output: {
                beautify: true,
                comments: /(?:^!|@(?:license|preserve))/
            }
        },
        minify: {
            compress: true,
            mangle: true,
            output: {
                comments: new RegExp(pkg.name)
            }
        }
    }
};


// Config Base
const config = {
    input: entryFile,
    output: {
        file: outputFile,
        banner: `/*!\n * ${bannerData.join('\n * ')}\n */`,
        sourcemap: true
    },
    plugins: [
        url(pluginSettings.url),
        postcss(pluginSettings.postcss),
        resolve(),
        commonjs(),
        json(),
        eslint(pluginSettings.eslint),
        babel(pluginSettings.babel)
    ],
    watch: {
        clearScreen: false
    }
};

// Format: IIFE
const iife = merge({}, config, {
    output: {
        format: 'iife'
    },
    plugins: [
        uglify(pluginSettings.uglify.beautify)
    ]
});

// Format: IIFE (Minified)
const iifeMinified = merge({}, config, {
    output: {
        file: iife.output.file.replace(/\.js$/, '.min.js'),
        format: iife.output.format
    },
    plugins: [
        uglify(pluginSettings.uglify.minify)
    ]
});


export default [
    iife,
    iifeMinified
];
