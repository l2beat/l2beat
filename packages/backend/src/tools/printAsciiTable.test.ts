import { expect } from 'earl'

import { printAsciiTable } from './printAsciiTable'

describe(printAsciiTable.name, () => {
  it('should print a table', () => {
    const headers = ['Id', 'Name', 'Year']
    const rows = [
      ['1', 'Tetris', '1985'],
      ['2', 'Minecraft', '2011'],
    ]

    const table = printAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '| Id |      Name | Year |',
        '|----|-----------|------|',
        '|  1 |    Tetris | 1985 |',
        '|  2 | Minecraft | 2011 |',
      ].join('\n'),
    )
  })

  it('should print a table where header is the widest', () => {
    const headers = ['Highest', 'Average', 'Lowest']
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ]

    const table = printAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '| Highest | Average | Lowest |',
        '|---------|---------|--------|',
        '|       1 |       2 |      3 |',
        '|       4 |       5 |      6 |',
        '|       7 |       8 |      9 |',
      ].join('\n'),
    )
  })

  it('should print a table where rows are the widest columns', () => {
    const headers = ['H', 'M', 'L']
    const rows = [
      ['Very true', 'flase', 'true'],
      ['false', 'Very false', 'true'],
      ['true', 'false', 'true - false'],
    ]

    const table = printAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '|         H |          M |            L |',
        '|-----------|------------|--------------|',
        '| Very true |      flase |         true |',
        '|     false | Very false |         true |',
        '|      true |      false | true - false |',
      ].join('\n'),
    )
  })
})
