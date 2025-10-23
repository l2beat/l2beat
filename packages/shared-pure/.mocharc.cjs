process.env.NODE_ENV = 'test'
module.exports = {
  spec: '{src,test}/**/*.test.ts',
  'node-option': [
    'experimental-specifier-resolution=node',
    'loader=ts-node/esm',
  ],
  watchExtensions: ['js', 'ts'],
  extension: ['js', 'ts'],
}
