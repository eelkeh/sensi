import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json');
// let external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/index.js',
  plugins: [
    babel(babelrc()),
    node({
      jsnext: true
    })
  ],
  // external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'sensible',
      sourceMap: true
    },
  ]
};
