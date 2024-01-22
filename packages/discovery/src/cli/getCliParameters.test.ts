import { expect } from 'earl'

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
    const cli = getCliParameters(['discover', 'ethereum', 'foo'])
    expect(cli).toEqual({
      mode: 'discover',
      chain: 'ethereum',
      project: 'foo',
      dryRun: false,
      dev: false,
      sourcesFolder: undefined,
      discoveryFilename: undefined,
      blockNumber: undefined,
    })
  })

  it('discover foo --dry-run', () => {
    const cli = getCliParameters(['discover', 'ethereum', 'foo', '--dry-run'])
    expect(cli).toEqual({
      mode: 'discover',
      chain: 'ethereum',
      project: 'foo',
      dryRun: true,
      dev: false,
      sourcesFolder: undefined,
      discoveryFilename: undefined,
      blockNumber: undefined,
    })
  })

  it('discover --dev foo --sources-folder=.code@1234 --discovery-filename=discovery@1234.json', () => {
    const cli = getCliParameters([
      'discover',
      '--dev',
      'ethereum',
      'foo',
      '--sources-folder=.code@1234',
      '--discovery-filename=discovery@1234',
    ])
    expect(cli).toEqual({
      mode: 'discover',
      chain: 'ethereum',
      project: 'foo',
      dryRun: false,
      dev: true,
      sourcesFolder: '.code@1234',
      discoveryFilename: 'discovery@1234',
      blockNumber: undefined,
    })
  })

  it('discover foo bar', () => {
    const cli = getCliParameters(['discover', 'foo', 'bar', 'baz'])
    expect(cli).toEqual({ mode: 'help', error: 'Too many arguments' })
  })

  it('discover foo bar baz', () => {
    const cli = getCliParameters(['discover', 'foo', 'bar', 'baz', 'qux'])
    expect(cli).toEqual({ mode: 'help', error: 'Too many arguments' })
  })

  it('discover ethereum --block-number=5678 foo --dry-run', () => {
    const cli = getCliParameters([
      'discover',
      'ethereum',
      '--block-number=5678',
      'foo',
      '--dry-run',
    ])
    expect(cli).toEqual({
      mode: 'discover',
      chain: 'ethereum',
      project: 'foo',
      dryRun: true,
      dev: false,
      sourcesFolder: undefined,
      discoveryFilename: undefined,
      blockNumber: 5678,
    })
  })
})
