module.exports = {
  extends: [
    '../../.eslintrc.json',
    'plugin:storybook/recommended',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    'classnames-order': 'off', // Prettier handles this
  },
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
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
}
