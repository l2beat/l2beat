import { expect } from 'earl'

import {
  parseGoogleSheetRows,
  upsertGoogleSheetsEnvSection,
} from './googleSheetsEnvSync'

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

    it('accepts values containing single quotes', () => {
      const result = parseGoogleSheetRows([
        ['ETHEREUM_RPC_URL', "https://rpc.example?key=it's-ok"],
      ])

      expect(result).toEqual([
        {
          key: 'ETHEREUM_RPC_URL',
          value: "https://rpc.example?key=it's-ok",
        },
      ])
    })
  })

  describe(upsertGoogleSheetsEnvSection.name, () => {
    it('prepends the managed section when markers are missing', () => {
      const result = upsertGoogleSheetsEnvSection(
        "LOCAL_DB_URL='postgres://localhost'\n",
        [{ key: 'ETHEREUM_RPC_URL', value: 'https://rpc.example' }],
      )

      expect(result).toEqual(
        [
          '# This section is synced from Google Sheets. Do not edit it manually.',
          '# Put local overrides below this block. env:sync rewrites everything between the markers.',
          '# >>> GOOGLE_SHEETS_SYNC_START >>>',
          "ETHEREUM_RPC_URL='https://rpc.example'",
          '# <<< GOOGLE_SHEETS_SYNC_END <<<',
          '',
          "LOCAL_DB_URL='postgres://localhost'",
          '',
        ].join('\n'),
      )
    })

    it('replaces only the managed section when markers already exist', () => {
      const current = [
        '# This section is synced from Google Sheets. Do not edit it manually.',
        '# Put local overrides below this block. env:sync rewrites everything between the markers.',
        '# >>> GOOGLE_SHEETS_SYNC_START >>>',
        'OLD_VALUE=1',
        '# <<< GOOGLE_SHEETS_SYNC_END <<<',
        '',
        "LOCAL_DB_URL='postgres://localhost'",
        '',
      ].join('\n')

      const result = upsertGoogleSheetsEnvSection(current, [
        { key: 'NEW_VALUE', value: '2' },
      ])

      expect(result).toEqual(
        [
          '# This section is synced from Google Sheets. Do not edit it manually.',
          '# Put local overrides below this block. env:sync rewrites everything between the markers.',
          '# >>> GOOGLE_SHEETS_SYNC_START >>>',
          'NEW_VALUE=2',
          '# <<< GOOGLE_SHEETS_SYNC_END <<<',
          '',
          "LOCAL_DB_URL='postgres://localhost'",
          '',
        ].join('\n'),
      )
    })
  })
})
