export interface SyncedEnvEntry {
  key: string
  value: string
}

const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/
// Variables configuring env:sync itself must never come from the sheet,
// otherwise the sheet could redirect where future syncs read from.
const LOCAL_ONLY_KEY_PREFIX = 'GOOGLE_SHEETS_'

const START_MARKER = '# >>> GOOGLE_SHEETS_SYNC_START >>>'
const END_MARKER = '# <<< GOOGLE_SHEETS_SYNC_END <<<'
const LINE_WIDTH = 74

const HEADER_TEXT = [
  'SYNCED SECTION - DO NOT EDIT ANYTHING BETWEEN THE MARKERS',
  '',
  'Everything here is overwritten by `pnpm env:sync` (run it in',
  'packages/backend) with the values from the shared Google Sheet.',
  '',
  'To use a different value, define the variable again BELOW the',
  'END marker: the last definition in this file wins.',
]

const FOOTER_TEXT = [
  'END OF THE SYNCED SECTION - put your own variables and overrides',
  'below this line.',
]

// Written above the start marker by earlier versions, removed when found.
const LEGACY_WARNING_LINES = [
  '# This section is synced from Google Sheets. Do not edit it manually.',
  '# Put local overrides below this block. env:sync rewrites everything between the markers.',
]

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
  syncedAt: Date,
): string {
  const eol = currentContent.includes('\r\n') ? '\r\n' : '\n'
  const section = renderManagedSection(entries, syncedAt, eol)
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

  const separator = currentContent.startsWith(eol) ? eol : `${eol}${eol}`
  return `${section}${separator}${ensureTrailingNewline(currentContent, eol)}`
}

interface TextRange {
  start: number
  end: number
}

// Markers are matched as whole lines by prefix, so the decoration after them
// can change freely, while marker text inside a quoted value is ignored.
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
    start: startOfLegacyWarningLines(content, start.start),
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

    if (lineBody.trim().startsWith(marker)) {
      result.push({ start: lineStart, end: lineStart + lineBody.length })
    }

    lineStart = lineEnd + 1
  }

  return result
}

function startOfLegacyWarningLines(content: string, markerStart: number) {
  const before = content.slice(0, markerStart)
  for (const eol of ['\r\n', '\n']) {
    const warning = `${LEGACY_WARNING_LINES.join(eol)}${eol}`
    if (before.endsWith(warning)) {
      return markerStart - warning.length
    }
  }
  return markerStart
}

function renderManagedSection(
  entries: SyncedEnvEntry[],
  syncedAt: Date,
  eol: string,
) {
  const body = entries.map((entry) => {
    assertRenderableValue(entry.key, entry.value)
    return `${entry.key}=${quoteForEnv(entry.value)}`
  })

  return [
    dashedLine(`${START_MARKER} `),
    ...box(HEADER_TEXT),
    dashedLineEndingWith(`last synced: ${formatUtc(syncedAt)}`),
    '',
    ...body,
    '',
    dashedLine('# '),
    ...box(FOOTER_TEXT),
    dashedLine(`${END_MARKER} `),
  ].join(eol)
}

function box(lines: string[]) {
  return ['', ...lines, ''].map(
    (line) => `# |${`   ${line}`.padEnd(LINE_WIDTH - 4)}|`,
  )
}

function dashedLine(prefix: string) {
  return prefix.padEnd(LINE_WIDTH, '-')
}

function dashedLineEndingWith(note: string) {
  return `${'# '.padEnd(LINE_WIDTH - note.length - 1, '-')} ${note}`
}

function formatUtc(date: Date) {
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

// Bash (`source .env`) and dotenv only agree on bare digits and single-quoted
// values, and a single quote cannot be represented inside the latter.
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
