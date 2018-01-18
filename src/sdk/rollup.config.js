require('dotenv').config();

import babel from 'rollup-plugin-babel';
import butternut from 'rollup-plugin-butternut';

const config = {
  input: __dirname + '/client.js',
  output: {
    file: __dirname + '/../../public/sdk.js',
    format: 'iife',
    name: 'Ambar',
    footer: `
if (window.ambarAsyncInit) {
  window.ambarAsyncInit();
}
    `
  },
  watch: {
    include: [__dirname + '/**']
  },
  plugins: [
    babel({
      presets: [['env', { modules: false }]],
      plugins: [
        'external-helpers',
        'transform-inline-environment-variables',
        'transform-object-rest-spread'
      ]
    })
  ]
};

if (process.env.NODE_ENV !== 'development') {
  config.plugins.push(butternut());
}

export default config;
