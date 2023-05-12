module.exports = {
  extends: '../../.eslintrc.json',
  rules: {
    // ban all node core imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^assert',
              'buffer',
              'child_process',
              'cluster',
              'crypto',
              'dgram',
              'dns',
              'domain',
              'events',
              'freelist',
              'fs',
              'http',
              'https',
              'module',
              'net',
              'os',
              'path',
              'punycode',
              'querystring',
              'readline',
              'repl',
              'smalloc',
              'stream',
              'string_decoder',
              'sys',
              'timers',
              'tls',
              'tracing',
              'tty',
              'url',
              'util',
              'vm',
              'zlib',
            ],
            message:
              'Do not use node dependencies inside this package as it can be used in frontend code. Use @l2beat/shared instead.',
          },
        ],
      },
    ],
  },
}
