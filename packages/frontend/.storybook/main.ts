import { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('storybook-addon-pseudo-states'),
    '@chromatic-com/storybook',
  ],

  framework: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    name: getAbsolutePath('@storybook/react-vite') as any,
    options: {},
  },
  staticDirs: ['../src/static', './static'],
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}
// biome-ignore lint/style/noDefaultExport: this is a config file
export default config

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}
