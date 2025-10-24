import chalk from 'chalk'
import { expect } from 'earl'
import { formatAsciiBorder } from './formatAsciiBorder.js'

describe(formatAsciiBorder.name, () => {
  it('should print a border', () => {
    const lines = ['line 1', 'line 2']
    const withBorder = formatAsciiBorder(lines)
    expect(withBorder).toEqual(
      ['┏━━━━━━━━┓', '┃ line 1 ┃', '┃ line 2 ┃', '┗━━━━━━━━┛'].join('\n'),
    )
  })

  it('should print a border where multiple widths', () => {
    const lines = ['line 1', 'line 23', 'line 345']
    const withBorder = formatAsciiBorder(lines)
    expect(withBorder).toEqual(
      [
        '┏━━━━━━━━━━┓',
        '┃ line 1   ┃',
        '┃ line 23  ┃',
        '┃ line 345 ┃',
        '┗━━━━━━━━━━┛',
      ].join('\n'),
    )
  })

  it('should print a border where rows are ansi colored', () => {
    const lines = [
      chalk.red('line 1'),
      chalk.green('line 2'),
      chalk.blue('line 3'),
    ]
    const withBorder = formatAsciiBorder(lines)
    expect(withBorder).toEqual(
      [
        '┏━━━━━━━━┓',
        `┃ ${chalk.red('line 1')} ┃`,
        `┃ ${chalk.green('line 2')} ┃`,
        `┃ ${chalk.blue('line 3')} ┃`,
        '┗━━━━━━━━┛',
      ].join('\n'),
    )
  })

  it('should print a border where rows are ansi colored multiple widths', () => {
    const lines = [
      chalk.red('line 1'),
      chalk.green('line 23'),
      chalk.blue('line 345'),
    ]
    const withBorder = formatAsciiBorder(lines)
    expect(withBorder).toEqual(
      [
        '┏━━━━━━━━━━┓',
        `┃ ${chalk.red('line 1')}   ┃`,
        `┃ ${chalk.green('line 23')}  ┃`,
        `┃ ${chalk.blue('line 345')} ┃`,
        '┗━━━━━━━━━━┛',
      ].join('\n'),
    )
  })

  it('should print a border in grey', () => {
    const lines = ['line 1', 'line 2']
    const withBorder = formatAsciiBorder(lines, true)
    expect(withBorder).toEqual(
      [
        chalk.grey('┏━━━━━━━━┓'),
        `${chalk.grey('┃')} line 1 ${chalk.grey('┃')}`,
        `${chalk.grey('┃')} line 2 ${chalk.grey('┃')}`,
        chalk.grey('┗━━━━━━━━┛'),
      ].join('\n'),
    )
  })

  it('should print a border in grey where rows are ansi colored', () => {
    const lines = [
      chalk.red('line 1'),
      chalk.green('line 2'),
      chalk.blue('line 3'),
    ]
    const withBorder = formatAsciiBorder(lines, true)
    expect(withBorder).toEqual(
      [
        chalk.grey('┏━━━━━━━━┓'),
        `${chalk.grey('┃')} ${chalk.red('line 1')} ${chalk.grey('┃')}`,
        `${chalk.grey('┃')} ${chalk.green('line 2')} ${chalk.grey('┃')}`,
        `${chalk.grey('┃')} ${chalk.blue('line 3')} ${chalk.grey('┃')}`,
        chalk.grey('┗━━━━━━━━┛'),
      ].join('\n'),
    )
  })
})
