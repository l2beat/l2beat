process.env.NODE_ENV = 'test'
module.exports = {
  require: ['../../scripts/mocha-random-order.cjs'],
  spec: '{src,test}/**/*.test.ts',
  'node-option': ['import=tsx'],
  watchExtensions: ['js', 'ts'],
  extension: ['js', 'ts'],
}
