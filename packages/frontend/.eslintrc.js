module.exports = {
  extends: '../../.eslintrc.json',
  overrides: [
    {
      files: ['*'],
      excludedFiles: ['**/src/build/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              '.',
              '..',
              '../..',
              '../../..',
              {
                name: '@l2beat/shared',
                message:
                  'Do not use @l2beat/shared in frontend code. Use @l2beat/shared-pure instead.',
              },
              {
                name: 'lodash',
                message: 'Import [module] from lodash/[module] instead',
              },
            ],
          },
        ],
      },
    },
  ],
}
