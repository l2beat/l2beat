import { estimateSimilarity } from '@l2beat/discovery'
import chalk from 'chalk'

import type { CliLogger } from '@l2beat/shared'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { type Project, removeCommonPath, transpose } from './common'

export function formatHeader(title: string): string {
  return `= ${title} `.padEnd(36, '=')
}

function formatTable(
  logger: CliLogger,
  aIDs: string[],
  bIDs: string[],
  matrix: Record<string, Record<string, number>>,
  options?: { forceTable?: boolean },
): string | undefined {
  const terminalWidth = process.stdout.columns

  const widths = [computeTableWidth(aIDs), computeTableWidth(bIDs)]
  const minTableWidth = Math.min(...widths)

  if (minTableWidth > terminalWidth && !options?.forceTable) {
    logger.logLine(
      [
        `${chalk.yellow('WARNING')}: Table is too wide to fit in the terminal`,
        `Terminal is ${terminalWidth} characters wide, table is ${minTableWidth} characters wide`,
        `Use ${chalk.magenta('--force-table')} to print the table anyway.`,
      ].join('\n'),
    )
    return
  }

  const shouldTranspose = widths[0] < widths[1]
  const header = ['IDs', ...(shouldTranspose ? aIDs : bIDs)]
  let rows = Object.values(matrix).map((row) =>
    Object.values(row).map((v) => colorMap(v)),
  )

  if (shouldTranspose) {
    rows = transpose(rows)
  }

  for (const [i, row] of rows.entries()) {
    row.unshift(shouldTranspose ? bIDs[i] : aIDs[i])
  }

  return formatAsAsciiTable(header, rows)
}

function computeTableWidth(headerColumns: string[]): number {
  const overhead = 5 + headerColumns.length + 2
  const columnWidths = headerColumns.map(
    (column) => Math.max(column.length, 4) + 2,
  )
  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0)
  return totalWidth + overhead
}

export function printComparisonBetweenProjects(
  logger: CliLogger,
  matrix: Record<string, Record<string, number>>,
  firstProject: Project,
  secondProject: Project,
  options?: { forceTable?: boolean },
): void {
  const aIds = removeCommonPath(
    firstProject.sources.map((source, i) => ({
      id: `A${i}`,
      path: source.path,
    })),
  )
  const bIds = removeCommonPath(
    secondProject.sources.map((source, i) => ({
      id: `B${i}`,
      path: source.path,
    })),
  )

  const table = formatTable(
    logger,
    aIds.map((a) => a.id),
    bIds.map((a) => a.id),
    matrix,
    options,
  )

  if (table) {
    logger.logLine(formatHeader(firstProject.name))
    logger.logLine(aIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    logger.logLine(formatHeader(secondProject.name))
    logger.logLine(bIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    logger.logLine('====================================\n')
    logger.logLine(table)
  }

  const concatenatedSimilarity = estimateSimilarity(
    firstProject.concatenatedSource,
    secondProject.concatenatedSource,
  )
  logger.logLine(
    `\nEstimated similarity between two projects: ${colorMap(
      concatenatedSimilarity,
    )}`,
  )
}

export function colorMap(value: number, multiplier: number = 1): string {
  const valueString = value.toFixed(2)

  if (value < 0.125 * multiplier) {
    return chalk.grey(valueString)
  } else if (value < 0.25 * multiplier) {
    return chalk.red(valueString)
  } else if (value < 0.375 * multiplier) {
    return chalk.redBright(valueString)
  } else if (value < 0.5 * multiplier) {
    return chalk.magenta(valueString)
  } else if (value < 0.625 * multiplier) {
    return chalk.magentaBright(valueString)
  } else if (value < 0.75 * multiplier) {
    return chalk.yellow(valueString)
  } else if (value < 0.875 * multiplier) {
    return chalk.yellowBright(valueString)
  } else {
    return chalk.greenBright(valueString)
  }
}
