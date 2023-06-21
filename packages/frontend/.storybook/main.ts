import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    'storycap',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ['../src/static', './static'],
  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@l2beat/config', '@l2beat/shared-pure'],
      },
    })
  },
}
export default config
