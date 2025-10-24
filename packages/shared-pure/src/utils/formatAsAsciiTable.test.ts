import chalk from 'chalk'
import { expect } from 'earl'

import { formatAsAsciiTable } from './formatAsAsciiTable.js'

describe(formatAsAsciiTable.name, () => {
  it('should print a table', () => {
    const headers = ['Id', 'Name', 'Year']
    const rows = [
      ['1', 'Tetris', '1985'],
      ['2', 'Minecraft', '2011'],
    ]

    const table = formatAsAsciiTable(headers, rows)
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

    const table = formatAsAsciiTable(headers, rows)
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
      ['Very true', 'false', 'true'],
      ['false', 'Very false', 'true'],
      ['true', 'false', 'true - false'],
    ]

    const table = formatAsAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '|         H |          M |            L |',
        '|-----------|------------|--------------|',
        '| Very true |      false |         true |',
        '|     false | Very false |         true |',
        '|      true |      false | true - false |',
      ].join('\n'),
    )
  })

  it('handles spaces', () => {
    const headers = ['Snake', 'Venomous', 'Origin']
    const rows = [
      ['Black mamba', 'Yes', 'Africa'],
      ['Green anaconda', ' ', 'South America'],
    ]

    const table = formatAsAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '|          Snake | Venomous |        Origin |',
        '|----------------|----------|---------------|',
        '|    Black mamba |      Yes |        Africa |',
        '| Green anaconda |          | South America |',
      ].join('\n'),
    )
  })

  it('handles ansi escape codes', () => {
    const headers = ['Snake', 'Venomous', 'Origin']
    const rows = [
      ['Black mamba', 'Yes', chalk.green('Africa')],
      [chalk.red('Green anaconda'), ' ', 'South America'],
    ]

    const table = formatAsAsciiTable(headers, rows)
    expect(table).toEqual(
      [
        '|          Snake | Venomous |        Origin |',
        '|----------------|----------|---------------|',
        `|    Black mamba |      Yes |        ${chalk.green('Africa')} |`,
        `| ${chalk.red('Green anaconda')} |          | South America |`,
      ].join('\n'),
    )
  })
})
