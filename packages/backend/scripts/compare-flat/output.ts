import chalk from 'chalk'

import { printAsciiTable } from '../../src/tools/printAsciiTable'
import {
  estimateSimilarity,
  Project,
  removeCommonPath,
  transpose,
} from './common'

export function formatHeader(title: string): string {
  return `= ${title} `.padEnd(36, '=')
}

export function formatTable(
  aIDs: string[],
  bIDs: string[],
  matrix: Record<string, Record<string, number>>,
  options?: { forceTable?: boolean },
): string | undefined {
  const terminalWidth = process.stdout.columns

  const widths = [computeTableWidth(aIDs), computeTableWidth(bIDs)]
  const minTableWidth = Math.min(...widths)

  if (minTableWidth > terminalWidth && !options?.forceTable) {
    console.log(
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
    Object.values(row).map(colorMap),
  )

  if (shouldTranspose) {
    rows = transpose(rows)
  }

  for (const [i, row] of rows.entries()) {
    row.unshift(shouldTranspose ? bIDs[i] : aIDs[i])
  }

  return printAsciiTable(header, rows)
}

export function computeTableWidth(headerColumns: string[]): number {
  const overhead = 5 + headerColumns.length + 2
  const columnWidths = headerColumns.map(
    (column) => Math.max(column.length, 4) + 2,
  )
  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0)
  return totalWidth + overhead
}

export function printComparisonBetweenProjects(
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
    aIds.map((a) => a.id),
    bIds.map((a) => a.id),
    matrix,
    options,
  )

  if (table) {
    console.log(formatHeader(firstProject.name))
    console.log(aIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log(formatHeader(secondProject.name))
    console.log(bIds.map((e) => `${e.id} - ${e.path}`).join('\n'))
    console.log('====================================\n')
    console.log(table)
  }

  const concatenatedSimilarity = estimateSimilarity(
    firstProject.concatenatedSource,
    secondProject.concatenatedSource,
  )
  console.log(
    `\nEstimated similarity between two projects: ${colorMap(
      concatenatedSimilarity,
    )}`,
  )
}

export function colorMap(value: number): string {
  const valueString = value.toFixed(2)

  if (value < 0.125) {
    return chalk.grey(valueString)
  } else if (value < 0.25) {
    return chalk.red(valueString)
  } else if (value < 0.375) {
    return chalk.redBright(valueString)
  } else if (value < 0.5) {
    return chalk.magenta(valueString)
  } else if (value < 0.625) {
    return chalk.magentaBright(valueString)
  } else if (value < 0.75) {
    return chalk.yellow(valueString)
  } else if (value < 0.875) {
    return chalk.yellowBright(valueString)
  } else {
    return chalk.greenBright(valueString)
  }
}
