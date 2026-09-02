export interface SyncedEnvEntry {
  key: string
  value: string
}

const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/
// These variables configure env:sync itself. If the sheet could set them, it
// could also redirect where every future sync reads from.
const LOCAL_ONLY_KEY_PREFIX = 'GOOGLE_SHEETS_'

const WARNING_LINE_1 =
  '# This section is synced from Google Sheets. Do not edit it manually.'
const WARNING_LINE_2 =
  '# Put local overrides below this block. env:sync rewrites everything between the markers.'
const START_MARKER = '# >>> GOOGLE_SHEETS_SYNC_START >>>'
const END_MARKER = '# <<< GOOGLE_SHEETS_SYNC_END <<<'

export function parseGoogleSheetRows(rows: string[][]): SyncedEnvEntry[] {
  const result: SyncedEnvEntry[] = []
  const seen = new Set<string>()

  for (const row of rows) {
    const extraColumns = row.slice(2).filter((value) => value.trim() !== '')
    if (extraColumns.length > 0) {
      throw new Error('Google Sheets sync expects exactly two columns')
    }

    const key = row[0]?.trim() ?? ''
    const value = row[1] ?? ''

    if (key === '' && value.trim() === '') {
      continue
    }

    if (key === '') {
      throw new Error(
        'Google Sheets sync found a row without an env variable name',
      )
    }

    if (!ENV_KEY.test(key)) {
      throw new Error(`Invalid env variable name: ${key}`)
    }

    if (key.startsWith(LOCAL_ONLY_KEY_PREFIX)) {
      throw new Error(
        `${key} configures env:sync itself and must stay local, remove it from the sheet`,
      )
    }

    if (seen.has(key)) {
      throw new Error(`Duplicate env variable name: ${key}`)
    }

    assertRenderableValue(key, value)

    seen.add(key)
    result.push({ key, value })
  }

  return result
}

export function upsertGoogleSheetsEnvSection(
  currentContent: string,
  entries: SyncedEnvEntry[],
): string {
  // Follow the line endings already used in the file instead of normalizing it.
  const eol = currentContent.includes('\r\n') ? '\r\n' : '\n'
  const section = renderManagedSection(entries, eol)
  const block = findManagedBlock(currentContent)

  if (block) {
    const updated =
      currentContent.slice(0, block.start) +
      section +
      currentContent.slice(block.end)
    return ensureTrailingNewline(updated, eol)
  }

  if (currentContent.trim() === '') {
    return `${section}${eol}`
  }

  // Keep the developer's content byte-for-byte, separated by one blank line.
  const separator = currentContent.startsWith(eol) ? eol : `${eol}${eol}`
  return `${section}${separator}${ensureTrailingNewline(currentContent, eol)}`
}

interface TextRange {
  start: number
  end: number
}

// The same matcher detects the block and delimits the replacement, so the two
// can never disagree. Markers are recognized as whole lines only, which means
// marker text inside a quoted value is ignored.
function findManagedBlock(content: string): TextRange | undefined {
  const starts = findMarkerLines(content, START_MARKER)
  const ends = findMarkerLines(content, END_MARKER)

  if (starts.length === 0 && ends.length === 0) {
    return undefined
  }

  if (starts.length !== ends.length) {
    throw new Error('Google Sheets sync markers are broken in .env')
  }

  if (starts.length > 1) {
    throw new Error('Google Sheets sync markers appear more than once in .env')
  }

  const start = starts[0]
  const end = ends[0]
  if (!start || !end || start.start > end.start) {
    throw new Error('Google Sheets sync markers are broken in .env')
  }

  return {
    start: startOfWarningLines(content, start.start),
    end: end.end,
  }
}

function findMarkerLines(content: string, marker: string): TextRange[] {
  const result: TextRange[] = []
  let lineStart = 0

  while (lineStart < content.length) {
    const newlineIndex = content.indexOf('\n', lineStart)
    const lineEnd = newlineIndex === -1 ? content.length : newlineIndex
    const line = content.slice(lineStart, lineEnd)
    const lineBody = line.endsWith('\r') ? line.slice(0, -1) : line

    if (lineBody.trim() === marker) {
      // The range covers the whole marker line but leaves its terminator
      // (\n or \r\n) untouched.
      result.push({ start: lineStart, end: lineStart + lineBody.length })
    }

    lineStart = lineEnd + 1
  }

  return result
}

function startOfWarningLines(content: string, markerStart: number): number {
  const before = content.slice(0, markerStart)
  for (const eol of ['\r\n', '\n']) {
    const warning = `${WARNING_LINE_1}${eol}${WARNING_LINE_2}${eol}`
    if (before.endsWith(warning)) {
      return markerStart - warning.length
    }
  }
  return markerStart
}

function renderManagedSection(entries: SyncedEnvEntry[], eol: string) {
  const body = entries.map((entry) => {
    assertRenderableValue(entry.key, entry.value)
    return `${entry.key}=${quoteForEnv(entry.value)}`
  })

  return [
    WARNING_LINE_1,
    WARNING_LINE_2,
    START_MARKER,
    ...body,
    END_MARKER,
  ].join(eol)
}

// Bash (`source .env`) and dotenv only agree on how to read bare digits and
// single-quoted values, and a single quote cannot be represented inside the
// latter, so anything else is rejected instead of being written ambiguously.
function assertRenderableValue(key: string, value: string) {
  if (value.includes('\n') || value.includes('\r')) {
    throw new Error(`Multiline values are not supported: ${key}`)
  }
  if (value.includes("'")) {
    throw new Error(`Values must not contain single quotes: ${key}`)
  }
}

const DIGITS_ONLY = /^\d+$/

function quoteForEnv(value: string) {
  return DIGITS_ONLY.test(value) ? value : `'${value}'`
}

function ensureTrailingNewline(input: string, eol: string) {
  return input.endsWith('\n') ? input : `${input}${eol}`
}
