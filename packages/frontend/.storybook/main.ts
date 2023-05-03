import type { StorybookViteConfig } from '@storybook/builder-vite'
import { mergeConfig } from 'vite'

const config: StorybookViteConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
    'storybook-dark-mode',
    'storycap',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ['../src/static', './static'],
  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@l2beat/config', '@l2beat/shared'],
      },
    })
  },
}

export default config
