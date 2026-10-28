import { expect } from 'earl'
import type { BoardRow, TableBlock } from './boardApi'
import {
  nextSort,
  shortAddress,
  sortRows,
  tableContracts,
  tableWidthPx,
  wideColumns,
} from './table'

describe(sortRows.name, () => {
  const rows: BoardRow[] = [
    { cells: [[{ text: '10' }]] },
    { cells: [[]] },
    { cells: [[{ text: '9' }]] },
    { cells: [[{ address: 'eth:0x1', name: '100' }]] },
  ]
  const order = (sorted: readonly BoardRow[]) =>
    sorted.map((r) => rows.indexOf(r))

  it('sorts numbers as numbers and keeps empty cells last', () => {
    expect(order(sortRows(rows, { column: 0, descending: false }))).toEqual([
      2, 0, 3, 1,
    ])
    expect(order(sortRows(rows, { column: 0, descending: true }))).toEqual([
      3, 0, 2, 1,
    ])
  })

  it('sorts decimals and negatives by value, before text', () => {
    const values = ['1.2', 'none', '-2', '1.11', '-10']
    const cells: BoardRow[] = values.map((text) => ({ cells: [[{ text }]] }))
    const sorted = sortRows(cells, { column: 0, descending: false })
    expect(sorted.map((r) => cells.indexOf(r))).toEqual([4, 2, 3, 0, 1])
  })

  it('keeps the written order without a sort', () => {
    expect(sortRows(rows, undefined)).toEqual(rows)
  })
})

describe(nextSort.name, () => {
  it('cycles a column through ascending, descending and unsorted', () => {
    const ascending = nextSort(undefined, 1)
    expect(ascending).toEqual({ column: 1, descending: false })
    const descending = nextSort(ascending, 1)
    expect(descending).toEqual({ column: 1, descending: true })
    expect(nextSort(descending, 1)).toEqual(undefined)
    expect(nextSort(descending, 0)).toEqual({ column: 0, descending: false })
  })
})

describe(tableContracts.name, () => {
  it('takes rows and contracts from graph columns only', () => {
    const table: TableBlock = {
      type: 'table',
      columns: ['Multisig', 'Signers', 'Upgrades'],
      graphColumns: [2],
      rows: [
        {
          address: 'eth:0xA',
          cells: [
            [{ address: 'eth:0xA', name: 'Council' }],
            [{ address: 'eth:0xS', name: 'Signer' }],
            [{ address: 'eth:0xB', name: 'Bridge' }, { text: 'and more' }],
          ],
        },
        { cells: [[{ text: 'computed' }], [], []] },
      ],
    }
    expect(tableContracts(table)).toEqual(['eth:0xA', 'eth:0xB'])
  })
})

describe(shortAddress.name, () => {
  it('keeps the chain and both ends of the address', () => {
    expect(
      shortAddress('eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'),
    ).toEqual('eth:0x8315…ed3a')
  })
})

describe(wideColumns.name, () => {
  it('marks columns that hold a sentence', () => {
    const table: TableBlock = {
      type: 'table',
      columns: ['Contract', 'Scope'],
      graphColumns: [],
      rows: [
        {
          cells: [
            [
              {
                address: 'eth:0xA',
                name: 'A name longer than forty characters, still a link',
              },
            ],
            [{ text: 'short' }],
          ],
        },
        {
          cells: [
            [{ address: 'eth:0xB', name: 'Bridge' }],
            [{ text: 'Stops messages in both directions and finalization.' }],
          ],
        },
      ],
    }
    expect(wideColumns(table)).toEqual([false, true])
  })
})

describe(tableWidthPx.name, () => {
  it('gives a column of sentences more room than one of names', () => {
    expect(tableWidthPx([false, false])).toEqual(220)
    expect(tableWidthPx([false, true])).toEqual(350)
  })
})
