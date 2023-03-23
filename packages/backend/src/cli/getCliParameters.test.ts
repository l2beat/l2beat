import { expect } from 'earljs'

import { getCliParameters } from './getCliParameters'

describe(getCliParameters.name, () => {
  it('no parameters', () => {
    const cli = getCliParameters([])
    expect(cli).toEqual({ mode: 'help', error: 'Not enough arguments' })
  })

  it('invalid parameter', () => {
    const cli = getCliParameters(['foo'])
    expect(cli).toEqual({ mode: 'help', error: 'Unknown mode: foo' })
  })

  it('server', () => {
    const cli = getCliParameters(['server'])
    expect(cli).toEqual({ mode: 'server' })
  })

  it('server foo', () => {
    const cli = getCliParameters(['server', 'foo'])
    expect(cli).toEqual({ mode: 'help', error: 'Too many arguments' })
  })

  it('discover', () => {
    const cli = getCliParameters(['discover'])
    expect(cli).toEqual({ mode: 'help', error: 'Not enough arguments' })
  })

  it('discover foo', () => {
    const cli = getCliParameters(['discover', 'foo'])
    expect(cli).toEqual({ mode: 'discover', project: 'foo' })
  })

  it('discover foo bar', () => {
    const cli = getCliParameters(['discover', 'foo', 'bar'])
    expect(cli).toEqual({ mode: 'help', error: 'Too many arguments' })
  })
})
