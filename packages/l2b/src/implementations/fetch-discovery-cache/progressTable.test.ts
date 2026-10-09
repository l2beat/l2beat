import { expect } from 'earl'
import { stripVTControlCharacters } from 'util'
import type { FetchStats } from './fetchDiscoveryCache'
import {
  formatFetchingRow,
  formatHeader,
  formatScanningRow,
  formatTotalRow,
} from './progressTable'

const NAME_WIDTH = 'getBlockNumberAtOrBefore'.length

describe('progressTable', () => {
  it('pads the header and every row to the same width', () => {
    const rows = [
      formatHeader(NAME_WIDTH),
      formatFetchingRow('getBlobs', NAME_WIDTH, stats({})),
      formatFetchingRow(
        'getBlockNumberAtOrBefore',
        NAME_WIDTH,
        stats({ keysScanned: 1315, keysMissing: 1315, keysFetched: 1315 }),
      ),
      formatFetchingRow(
        'getSource-v3',
        NAME_WIDTH,
        stats({
          keysScanned: 17559,
          keysMissing: 17559,
          keysFetched: 8000,
          keysEvicted: 12,
          bytesTransferred: 142_700_000,
          bytesDecoded: 438_050_000,
        }),
      ),
    ].map(stripVTControlCharacters)

    for (const row of rows) {
      expect(row.length).toEqual(rows[0].length)
    }
  })

  it('starts the total row with the same columns as the others', () => {
    const total = stripVTControlCharacters(
      formatTotalRow(NAME_WIDTH, stats({}), 21_000),
    )
    const header = stripVTControlCharacters(formatHeader(NAME_WIDTH))

    expect(total).toEqual(`${total.slice(0, header.length)}  in 21s`)
  })

  it('shows a kind with nothing to fetch as complete', () => {
    const row = stripVTControlCharacters(
      formatFetchingRow('getBlobs', NAME_WIDTH, stats({ keysScanned: 45 })),
    )

    expect(row.includes('100%')).toEqual(true)
    expect(row.includes('0/0')).toEqual(true)
  })

  it('shows how many keys were found while scanning', () => {
    const row = stripVTControlCharacters(
      formatScanningRow('getBlobs', NAME_WIDTH, 30),
    )

    expect(row).toEqual(
      `${'getBlobs'.padEnd(NAME_WIDTH)}  scanning, 30 keys found`,
    )
  })
})

function stats(overrides: Partial<FetchStats>): FetchStats {
  return {
    keysScanned: 0,
    keysMissing: 0,
    keysFetched: 0,
    keysEvicted: 0,
    bytesTransferred: 0,
    bytesDecoded: 0,
    ...overrides,
  }
}
