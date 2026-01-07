import chalk from 'chalk'
import { stripAnsiEscapeCodes } from './formatAsAsciiTable.js'

export function formatAsciiBorder(lines: string[], colorGrey = false): string {
  const maxWidth = lines.reduce(
    (acc, v) => Math.max(acc, stripAnsiEscapeCodes(v).length),
    0,
  )

  const result = []
  result.push(getTopBorder(maxWidth, colorGrey))
  for (const line of lines) {
    const lengthDifference = line.length - stripAnsiEscapeCodes(line).length
    const border = colorGrey ? chalk.grey('┃') : '┃'
    result.push(
      `${border} ${line.padEnd(maxWidth + lengthDifference)} ${border}`,
    )
  }
  result.push(getBottomBorder(maxWidth, colorGrey))

  return result.join('\n')
}

function getTopBorder(width: number, colorGrey: boolean) {
  let result = `┏${'━'.repeat(width + 2)}┓`
  if (colorGrey) {
    result = chalk.grey(result)
  }
  return result
}

function getBottomBorder(width: number, colorGrey: boolean) {
  let result = `┗${'━'.repeat(width + 2)}┛`
  if (colorGrey) {
    result = chalk.grey(result)
  }
  return result
}
