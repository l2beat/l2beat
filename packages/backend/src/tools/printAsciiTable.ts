export function printAsciiTable(headers: string[], rows: string[][]): string {
  const columnBiggestWidths = headers.map((_, i) =>
    Math.max(...rows.map((row) => row[i].length), headers[i].length),
  )

  const header = `| ${headers
    .map((header, i) => header.padStart(columnBiggestWidths[i]))
    .join(' | ')} |`

  const separator = `|-${headers
    .map((_, i) => '-'.repeat(columnBiggestWidths[i]))
    .join('-|-')}-|`

  const body = rows
    .map(
      (row) =>
        `| ${row
          .map((cell, i) => cell.padStart(columnBiggestWidths[i]))
          .join(' | ')} |`,
    )
    .join('\n')

  return `${header}\n${separator}\n${body}`
}
