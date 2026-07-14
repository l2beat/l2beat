process.env.NODE_ENV = 'test'
module.exports = {
  spec: '{src,test}/**/*.test.ts',
  'node-option': ['import=tsx'],
  watchExtensions: ['js', 'ts'],
  extension: ['js', 'ts'],
}
