export function formatAsAsciiTable(
  headers: string[],
  rows: string[][],
): string {
  const columnBiggestWidths = headers.map((_, i) =>
    Math.max(
      ...rows.map((row) => stripAnsiEscapeCodes(row[i]).length),
      stripAnsiEscapeCodes(headers[i]).length,
    ),
  )

  const header = `| ${headers
    .map((header, i) => {
      const strippedHeader = stripAnsiEscapeCodes(header)
      const lengthDifference = header.length - strippedHeader.length
      return header.padStart(columnBiggestWidths[i] + lengthDifference)
    })
    .join(' | ')} |`

  const separator = `|-${headers
    .map((_, i) => '-'.repeat(columnBiggestWidths[i]))
    .join('-|-')}-|`

  const body = rows
    .map(
      (row) =>
        `| ${row
          .map((cell, i) => {
            const strippedHeader = stripAnsiEscapeCodes(cell)
            const lengthDifference = cell.length - strippedHeader.length
            return cell.padStart(columnBiggestWidths[i] + lengthDifference)
          })
          .join(' | ')} |`,
    )
    .join('\n')

  return `${header}\n${separator}\n${body}`
}

export function stripAnsiEscapeCodes(str: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ansi escape codes are control characters
  const ansiEscapeCodesPattern = /\x1b\[[0-9;]*m/g
  return str.replace(ansiEscapeCodesPattern, '')
}
