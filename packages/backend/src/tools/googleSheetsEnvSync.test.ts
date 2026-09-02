import { expect } from 'earl'

import {
  parseGoogleSheetRows,
  upsertGoogleSheetsEnvSection,
} from './googleSheetsEnvSync'

const WARNING_LINES = [
  '# This section is synced from Google Sheets. Do not edit it manually.',
  '# Put local overrides below this block. env:sync rewrites everything between the markers.',
]
const START_MARKER = '# >>> GOOGLE_SHEETS_SYNC_START >>>'
const END_MARKER = '# <<< GOOGLE_SHEETS_SYNC_END <<<'

function managedSection(...body: string[]) {
  return [...WARNING_LINES, START_MARKER, ...body, END_MARKER]
}

function file(lines: string[], eol = '\n') {
  return `${lines.join(eol)}${eol}`
}

describe('googleSheetsEnvSync', () => {
  describe(parseGoogleSheetRows.name, () => {
    it('parses rows and skips blank ones', () => {
      const result = parseGoogleSheetRows([
        ['ETHEREUM_RPC_URL', 'https://rpc.example'],
        ['', ''],
        ['ETHEREUM_RPC_CALLS_PER_MINUTE', '120'],
      ])

      expect(result).toEqual([
        {
          key: 'ETHEREUM_RPC_URL',
          value: 'https://rpc.example',
        },
        {
          key: 'ETHEREUM_RPC_CALLS_PER_MINUTE',
          value: '120',
        },
      ])
    })

    it('fails on duplicate env names', () => {
      expect(() =>
        parseGoogleSheetRows([
          ['ETHEREUM_RPC_URL', 'https://rpc-1.example'],
          ['ETHEREUM_RPC_URL', 'https://rpc-2.example'],
        ]),
      ).toThrow('Duplicate env variable name: ETHEREUM_RPC_URL')
    })

    it('fails on rows with more than two columns', () => {
      expect(() =>
        parseGoogleSheetRows([
          ['ETHEREUM_RPC_URL', 'https://rpc.example', 'a note'],
        ]),
      ).toThrow('Google Sheets sync expects exactly two columns')
    })

    it('fails on invalid env names', () => {
      expect(() =>
        parseGoogleSheetRows([['ETHEREUM RPC URL', 'https://rpc.example']]),
      ).toThrow('Invalid env variable name: ETHEREUM RPC URL')
    })

    it('rejects values containing single quotes', () => {
      expect(() =>
        parseGoogleSheetRows([
          ['ETHEREUM_RPC_URL', "https://rpc.example?key=it's-not-ok"],
        ]),
      ).toThrow('Values must not contain single quotes: ETHEREUM_RPC_URL')
    })

    it('rejects multiline values', () => {
      expect(() =>
        parseGoogleSheetRows([
          ['ETHEREUM_RPC_URL', 'https://rpc.example\nX=1'],
        ]),
      ).toThrow('Multiline values are not supported: ETHEREUM_RPC_URL')
    })

    it('rejects the variables that configure the sync itself', () => {
      expect(() =>
        parseGoogleSheetRows([
          ['GOOGLE_SHEETS_ENV_URL', 'https://docs.google.com/spreadsheets/d/x'],
        ]),
      ).toThrow(
        'GOOGLE_SHEETS_ENV_URL configures env:sync itself and must stay local, remove it from the sheet',
      )
    })
  })

  describe(upsertGoogleSheetsEnvSection.name, () => {
    it('prepends the managed section when markers are missing', () => {
      const result = upsertGoogleSheetsEnvSection(
        "LOCAL_DB_URL='postgres://localhost'\n",
        [{ key: 'ETHEREUM_RPC_URL', value: 'https://rpc.example' }],
      )

      expect(result).toEqual(
        file([
          ...managedSection("ETHEREUM_RPC_URL='https://rpc.example'"),
          '',
          "LOCAL_DB_URL='postgres://localhost'",
        ]),
      )
    })

    it('replaces only the managed section when markers already exist', () => {
      const current = file([
        ...managedSection('OLD_VALUE=1'),
        '',
        "LOCAL_DB_URL='postgres://localhost'",
      ])

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'NEW_VALUE', value: '2' },
      ])

      expect(result).toEqual(
        file([
          ...managedSection('NEW_VALUE=2'),
          '',
          "LOCAL_DB_URL='postgres://localhost'",
        ]),
      )
    })

    it('writes dollar signs literally', () => {
      const current = file([...managedSection('OLD_VALUE=1'), '', 'LOCAL=1'])

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'A', value: 'pa$$word' },
        { key: 'B', value: 'x$&y' },
        { key: 'C', value: 'x$`y' },
      ])

      expect(result).toEqual(
        file([
          ...managedSection("A='pa$$word'", "B='x$&y'", "C='x$`y'"),
          '',
          'LOCAL=1',
        ]),
      )
    })

    it('recognizes markers surrounded by whitespace', () => {
      const current = file([
        ...WARNING_LINES,
        `  ${START_MARKER}  `,
        'OLD_VALUE=1',
        `${END_MARKER}\t`,
        '',
        'LOCAL=1',
      ])

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'NEW_VALUE', value: '2' },
      ])

      expect(result).toEqual(
        file([...managedSection('NEW_VALUE=2'), '', 'LOCAL=1']),
      )
    })

    it('ignores marker text inside values', () => {
      const current = file([
        ...managedSection('OLD_VALUE=1'),
        '',
        `LOCAL='${END_MARKER}'`,
      ])

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'NEW_VALUE', value: '2' },
      ])

      expect(result).toEqual(
        file([...managedSection('NEW_VALUE=2'), '', `LOCAL='${END_MARKER}'`]),
      )
    })

    it('fails when only one marker is present', () => {
      const current = file([START_MARKER, 'OLD_VALUE=1', '', 'LOCAL=1'])

      expect(() =>
        upsertGoogleSheetsEnvSection(current, [{ key: 'A', value: '1' }]),
      ).toThrow('Google Sheets sync markers are broken in .env')
    })

    it('fails when the end marker comes before the start marker', () => {
      const current = file([END_MARKER, 'OLD_VALUE=1', START_MARKER])

      expect(() =>
        upsertGoogleSheetsEnvSection(current, [{ key: 'A', value: '1' }]),
      ).toThrow('Google Sheets sync markers are broken in .env')
    })

    it('fails when markers appear more than once', () => {
      const current = file([
        ...managedSection('OLD_VALUE=1'),
        ...managedSection('OLD_VALUE=2'),
      ])

      expect(() =>
        upsertGoogleSheetsEnvSection(current, [{ key: 'A', value: '1' }]),
      ).toThrow('Google Sheets sync markers appear more than once in .env')
    })

    it('preserves CRLF line endings', () => {
      const current = file(
        [...managedSection('OLD_VALUE=1'), '', 'LOCAL=1'],
        '\r\n',
      )

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'NEW_VALUE', value: 'x' },
      ])

      expect(result).toEqual(
        file([...managedSection("NEW_VALUE='x'"), '', 'LOCAL=1'], '\r\n'),
      )
    })

    it('writes just the section into an empty file', () => {
      const result = upsertGoogleSheetsEnvSection('', [
        { key: 'A', value: '1' },
      ])

      expect(result).toEqual(file(managedSection('A=1')))
    })

    it('keeps existing content intact and adds a missing trailing newline', () => {
      const result = upsertGoogleSheetsEnvSection('\nLOCAL=1', [
        { key: 'A', value: '1' },
      ])

      expect(result).toEqual(file([...managedSection('A=1'), '', 'LOCAL=1']))
    })

    it('refuses to render values that cannot be quoted safely', () => {
      expect(() =>
        upsertGoogleSheetsEnvSection('', [{ key: 'A', value: "it's" }]),
      ).toThrow('Values must not contain single quotes: A')
    })
  })
})
