const { mergeConfig } = require('vite')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ['../src/static', '../src/stories/static'],
  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@l2beat/config', '@l2beat/types'],
      },
    })
  },
}
