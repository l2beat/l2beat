import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
// @ts-expect-error No types for this plugin
import storybook from 'eslint-plugin-storybook'
import tailwind from 'eslint-plugin-tailwindcss'
import tsEslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const eslintConfig = [
  ...fixupConfigRules(
    compat.extends('next/core-web-vitals', 'plugin:react-hooks/recommended'),
  ),
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  ...tailwind.configs['flat/recommended'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: true,
      },
    },

    settings: {
      tailwindcss: {
        callees: ['cn', 'cva'],
      },
    },

    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
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

      'tailwindcss/classnames-order': ['error'],
      'tailwindcss/enforces-negative-arbitrary-values': ['error'],
      'tailwindcss/enforces-shorthand': ['error'],
      'tailwindcss/no-contradicting-classname': ['error'],
      'tailwindcss/no-unnecessary-arbitrary-value': ['error'],
    },
  },
]

export default eslintConfig
