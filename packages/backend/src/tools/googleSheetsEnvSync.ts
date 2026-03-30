export interface SyncedEnvEntry {
  key: string
  value: string
}

const ENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

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

    if (seen.has(key)) {
      throw new Error(`Duplicate env variable name: ${key}`)
    }

    if (value.includes('\n') || value.includes('\r')) {
      throw new Error(`Multiline values are not supported: ${key}`)
    }

    seen.add(key)
    result.push({ key, value })
  }

  return result
}

export function upsertGoogleSheetsEnvSection(
  currentContent: string,
  entries: SyncedEnvEntry[],
) {
  const normalized = currentContent.replace(/\r\n/g, '\n')
  const startCount = countOccurrences(normalized, START_MARKER)
  const endCount = countOccurrences(normalized, END_MARKER)

  if (startCount !== endCount) {
    throw new Error('Google Sheets sync markers are broken in .env')
  }

  if (startCount > 1) {
    throw new Error('Google Sheets sync markers appear more than once in .env')
  }

  const section = renderManagedSection(entries)
  const pattern = new RegExp(
    `(?:${escapeForRegex(WARNING_LINE_1)}\\n${escapeForRegex(WARNING_LINE_2)}\\n)?${escapeForRegex(START_MARKER)}\\n[\\s\\S]*?\\n${escapeForRegex(END_MARKER)}`,
  )

  if (pattern.test(normalized)) {
    return ensureTrailingNewline(normalized.replace(pattern, section))
  }

  const rest = normalized.replace(/^\n+/, '')
  if (rest === '') {
    return `${section}\n`
  }

  return `${section}\n\n${ensureTrailingNewline(rest)}`
}

function renderManagedSection(entries: SyncedEnvEntry[]) {
  const body = entries
    .map((entry) => `${entry.key}=${quoteForEnv(entry.value)}`)
    .join('\n')

  return [WARNING_LINE_1, WARNING_LINE_2, START_MARKER, body, END_MARKER]
    .filter((line, index) => line !== '' || index < 3)
    .join('\n')
}

const DIGITS_ONLY = /^\d+$/

function quoteForEnv(value: string) {
  if (DIGITS_ONLY.test(value)) {
    return value
  }
  if (!value.includes("'")) {
    return `'${value}'`
  }
  const escaped = value
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('$', '\\$')
    .replaceAll('`', '\\`')
  return `"${escaped}"`
}

function countOccurrences(input: string, pattern: string) {
  return input.split(pattern).length - 1
}

function escapeForRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function ensureTrailingNewline(input: string) {
  return input.endsWith('\n') ? input : `${input}\n`
}
