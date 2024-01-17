module.exports = {
  extends: ['plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      processor: 'astro/client-side-ts',
      rules: {},
    },
  ],
}
