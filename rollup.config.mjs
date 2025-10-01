import autoprefixer from 'autoprefixer';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import merge from 'lodash.merge';
import pkg from './package.json' with { type: 'json' };

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
    exclude: ['node_modules/**', './package.json', '**/*.scss'],
    throwOnWarning: false,
    throwOnError: true
  },
  babel: {
    exclude: ['node_modules/**'],
    babelHelpers: 'bundled',
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
    ],
    use: {
      sass: {
        // https://github.com/egoist/rollup-plugin-postcss/issues/463
        silenceDeprecations: ['legacy-js-api'],
      }
    }
  },
  url: {
    limit: 10 * 1024, // inline files < 10k, copy files > 10k
    include: ["**/*.svg"], // defaults to .svg, .png, .jpg and .gif files
    emitFiles: true // defaults to true
  },
  terser: {
    beautify: {
      compress: false,
      mangle: false,
      output: {
        beautify: true,
        comments: /^!|@(?:license|preserve)/
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
  input: './src/index.js',
  output: {
    file: `./dist/${pkg.name}.js`,
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
    babel(pluginSettings.babel),
    ...process.env.BUILD === 'development' ? [serve({
      open: false,
      host: 'localhost',
      port: 35412,
      contentBase: ['dist', 'samples'],
      onListening: function (server) {
        const address = server.address();
        const host = address.address === '::' ? 'localhost' : address.address;
        const protocol = this.https ? 'https' : 'https';
        console.log(`Server listening at ${protocol}://${host}:${address.port}/`);
        }
    })] : []
  ],
  watch: {
    clearScreen: false,
    include: ['src/**']
  }
};

// Format: IIFE
const iife = merge({}, config, {
  output: {
    format: 'iife'
  },
  plugins: [
    terser(pluginSettings.terser.beautify)
  ]
});

// Format: IIFE (Minified)
const iifeMinified = merge({}, config, {
  output: {
    file: iife.output.file.replace(/\.js$/, '.min.js'),
    format: iife.output.format
  },
  plugins: [
    terser(pluginSettings.terser.minify)
  ]
});

export default [
  iife,
  iifeMinified
];
