import chalk from 'chalk'

export function formatServicePretty(
  service: string | undefined,
  tag: string | undefined,
  colors: boolean,
): string {
  const formatted = tagService(service, tag)
  if (!formatted) {
    return ''
  }
  return colors
    ? ` ${chalk.gray('[')} ${chalk.yellow(formatted)} ${chalk.gray(']')}`
    : ` [ ${formatted} ]`
}

export function tagService(
  service: string | undefined,
  tag: string | undefined,
): string | undefined {
  const concat = (service ?? '') + (tag ? `:${tag}` : '')
  return concat ? concat : undefined
}
