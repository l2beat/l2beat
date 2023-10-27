import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import turbosnap from 'vite-plugin-turbosnap'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    '@storybook/addon-interactions',
    'storybook-addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ['../src/static', './static'],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@l2beat/config', '@l2beat/shared-pure'],
      },
      plugins:
        configType === 'PRODUCTION'
          ? [
              turbosnap({
                rootDir: process.cwd(),
              }),
            ]
          : [],
    })
  },
}
export default config
