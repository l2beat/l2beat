/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'
import { inspect } from 'util'

const STYLES = {
  bigint: 'white',
  boolean: 'white',
  date: 'white',
  module: 'white',
  name: 'blue',
  null: 'white',
  number: 'white',
  regexp: 'white',
  special: 'white',
  string: 'white',
  symbol: 'white',
  undefined: 'white',
}

const INDENT_SIZE = 4
const INDENT = ' '.repeat(INDENT_SIZE)

export function formatParametersPretty(
  parameters: {},
  colors: boolean,
): string {
  const oldStyles = inspect.styles
  inspect.styles = STYLES

  const inspected = inspect(parameters, {
    colors,
    breakLength: 80 - INDENT_SIZE,
    depth: 5,
  })

  inspect.styles = oldStyles

  if (inspected === '{}') {
    return ''
  }

  const indented = inspected
    .split('\n')
    .map((x) => INDENT + x)
    .join('\n')

  if (colors) {
    return '\n' + chalk.gray(indented)
  }
  return '\n' + indented
}
