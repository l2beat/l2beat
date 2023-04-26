import { format } from 'prettier'

export function toPrettyJson(value: unknown) {
  const ugly = JSON.stringify(value, null, 2)
  return format(ugly, {
    parser: 'json',
    // our config is in .prettierrc
    semi: false,
    singleQuote: true,
    printWidth: 80,
    bracketSpacing: true,
    trailingComma: 'all',
  })
}
