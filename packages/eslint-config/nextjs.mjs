import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

import mochaPlugin from 'eslint-plugin-mocha'
import tailwind from 'eslint-plugin-tailwindcss'
import tsEslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const nonFlatConfigs = fixupConfigRules(
  compat.extends(
    'next/core-web-vitals',
    'plugin:react-hooks/recommended',
    'turbo',
  ),
)

const typescriptConfigs = tsEslint.config(
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/require-await': 'off',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
)

const tailwindConfigs = tsEslint.config(
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        callees: ['cn', 'cva'],
      },
    },
    rules: {
      'tailwindcss/classnames-order': ['error'],
      'tailwindcss/enforces-negative-arbitrary-values': ['error'],
      'tailwindcss/enforces-shorthand': ['error'],
      'tailwindcss/no-contradicting-classname': ['error'],
      'tailwindcss/no-unnecessary-arbitrary-value': ['error'],
    },
  },
)

const mochaConfigs = tsEslint.config(mochaPlugin.configs.flat.recommended, {
  rules: {
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-setup-in-describe': 'off',
  },
})

const config = tsEslint.config(
  ...nonFlatConfigs,
  ...typescriptConfigs,
  ...tailwindConfigs,
  ...mochaConfigs,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'console',
              message: 'Do not use console',
            },
            {
              name: 'node:console',
              message: 'Do not use console',
            },
            {
              name: 'assert',
              message: 'Use assert from @l2beat/shared-pure',
            },
            {
              name: 'node:assert',
              message: 'Use assert from @l2beat/shared-pure',
            },
            {
              name: 'next/router',
              message: 'Use router from next/navigation',
            },
          ],
        },
      ],
    },
  },
)

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config
