import repoConfig from '@l2beat/eslint-config/nextjs'
// @ts-expect-error No types for this plugin
import storybook from 'eslint-plugin-storybook'

const config = [...repoConfig, ...storybook.configs['flat/recommended']]

export default config
