import chalk from 'chalk'

export function logHandler(field: string, values: string[]) {
  const dots = '.'.repeat(Math.max(1, 25 - field.length))
  const content = values
    .map((v, i) => (i % 2 === 0 ? v : chalk.blue(v)))
    .join('')
  console.log(`  ${chalk.yellow(field)} ${chalk.gray(dots)} ${content}`)
}
