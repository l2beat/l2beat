module.exports = {
  extends: '../../.eslintrc.json',
  overrides: [
    {
      files: ['*'],
      excludedFiles: ['**/build/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error', { paths: ['@l2beat/shared'] }],
      },
    },
  ],
}
