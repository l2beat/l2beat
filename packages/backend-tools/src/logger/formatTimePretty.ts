import chalk from 'chalk'

export function formatTimePretty(
  now: Date,
  utc: boolean,
  colors: boolean,
): string {
  const h = (utc ? now.getUTCHours() : now.getHours())
    .toString()
    .padStart(2, '0')
  const m = (utc ? now.getUTCMinutes() : now.getMinutes())
    .toString()
    .padStart(2, '0')
  const s = (utc ? now.getUTCSeconds() : now.getSeconds())
    .toString()
    .padStart(2, '0')
  const ms = (utc ? now.getUTCMilliseconds() : now.getMilliseconds())
    .toString()
    .padStart(3, '0')

  let result = `${h}:${m}:${s}.${ms}`
  if (utc) {
    result += 'Z'
  }

  return colors ? chalk.gray(result) : result
}
