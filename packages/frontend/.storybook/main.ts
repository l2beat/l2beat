import { dirname, join } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use pnpm PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('storybook-addon-pseudo-states'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },

  staticDirs: [
    '../public',
    {
      from: '../src/fonts',
      to: 'src/fonts',
    },
  ],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}
export default config
