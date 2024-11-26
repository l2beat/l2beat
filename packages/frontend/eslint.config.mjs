import repoConfig from '@l2beat/eslint-config/nextjs'
import storybook from 'eslint-plugin-storybook'

const config = [...repoConfig, ...storybook.configs['flat/recommended']]

export default config
