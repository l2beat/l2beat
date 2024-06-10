import path from 'path'
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
  viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        // Remove this once we are good to go with Context
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          async_hooks: '.storybook/polyfills/async_hooks.js',
          '../content/getCollection': path.resolve(
            __dirname,
            '../src/content/getCollection.mock.ts',
          ),
        },
      },
      optimizeDeps: {
        exclude: ['@l2beat/discovery'],
        include: ['@l2beat/config', '@l2beat/shared-pure'],
        esbuildOptions: {
          target: 'es2020',
        },
      },
      build: {
        target: 'es2020',
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
// biome-ignore lint/style/noDefaultExport: this is a config file
export default config
