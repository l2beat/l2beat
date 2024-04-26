import chalk from 'chalk'

export function formatServicePretty(
  service: string | undefined,
  colors: boolean,
): string {
  if (!service) {
    return ''
  }
  return colors
    ? ` ${chalk.gray('[')} ${chalk.yellow(service)} ${chalk.gray(']')}`
    : ` [ ${service} ]`
}
