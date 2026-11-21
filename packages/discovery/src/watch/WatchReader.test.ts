import { v } from '@l2beat/validate'
import { expect } from 'earl'
import mockFs from 'mock-fs'
import { WatchReader } from './WatchReader'
import type { WatchTemplate } from './WatchTemplate'

const Params = v.strictObject({ url: v.string() })
const page: WatchTemplate<typeof Params> = {
  name: 'page',
  params: Params,
  fetch: async ({ url }) => url,
}
const TEMPLATES: Record<string, WatchTemplate> = { page }

const watchJsonc = (watches: unknown) => JSON.stringify({ watches })
const configJsonc = (name: string, archived?: boolean) =>
  JSON.stringify({
    name,
    archived,
    initialAddresses: ['eth:0x0000000000000000000000000000000000000001'],
  })
const PAGE_WATCH = { template: 'page', params: { url: 'https://a' } }

describe(WatchReader.name, () => {
  beforeEach(() => {
    mockFs({
      '/projects/alpha/config.jsonc': configJsonc('alpha'),
      '/projects/alpha/watch.jsonc': watchJsonc({
        z: PAGE_WATCH,
        a: PAGE_WATCH,
      }),
      '/projects/alpha/watched.json': JSON.stringify({
        timestamp: 1,
        values: { a: 'https://a', z: 'https://a' },
      }),
      '/projects/beta/config.jsonc': configJsonc('beta'),
      '/projects/archived/config.jsonc': configJsonc('archived', true),
      '/projects/archived/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
      '/projects/near/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
      '/projects/_templates/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
      '/projects/unknown/watch.jsonc': watchJsonc({
        a: { template: 'missing', params: {} },
      }),
      '/projects/invalid/watch.jsonc': watchJsonc({
        a: { template: 'page', params: { url: 1 } },
      }),
      '/watches/ossification/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
      '/watches/_drafts/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
    })
  })

  afterEach(() => mockFs.restore())

  const PATHS = { discovery: '/projects', watches: '/watches' }
  const reader = () => new WatchReader(PATHS, TEMPLATES)

  it('lists project and global watches, skipping archived and _ directories', () => {
    expect(reader().readAllWatches()).toEqual([
      { name: 'alpha', kind: 'project', path: '/projects/alpha' },
      { name: 'invalid', kind: 'project', path: '/projects/invalid' },
      { name: 'near', kind: 'project', path: '/projects/near' },
      { name: 'ossification', kind: 'global', path: '/watches/ossification' },
      { name: 'unknown', kind: 'project', path: '/projects/unknown' },
    ])
  })

  it('works without a global watches directory', () => {
    const projectsOnly = { discovery: '/projects', watches: '/missing' }
    const names = new WatchReader(projectsOnly, TEMPLATES)
      .readAllWatches()
      .map((location) => location.name)
    expect(names).toEqual(['alpha', 'invalid', 'near', 'unknown'])
  })

  it('rejects a global watch named like a project directory', () => {
    mockFs({
      '/projects/beta/config.jsonc': configJsonc('beta'),
      '/watches/beta/watch.jsonc': watchJsonc({ a: PAGE_WATCH }),
    })
    expect(reader).toThrow('Global watch named like a project')
  })

  it('resolves a global watch by name like a project watch', () => {
    expect(reader().getWatchPath('ossification')).toEqual(
      '/watches/ossification',
    )
    expect(reader().readWatchConfig('ossification').watches.length).toEqual(1)
  })

  it('parses watch.jsonc sorted by key with validated params', () => {
    const config = reader().readWatchConfig('alpha')
    expect(config.name).toEqual('alpha')
    expect(config.watches.map((w) => [w.key, w.template, w.params])).toEqual([
      ['a', page, { url: 'https://a' }],
      ['z', page, { url: 'https://a' }],
    ])
  })

  it('rejects an unknown template and invalid params', () => {
    expect(() => reader().readWatchConfig('unknown')).toThrow(
      'Unknown watch template',
    )
    expect(() => reader().readWatchConfig('invalid')).toThrow(
      'Invalid watch params',
    )
  })

  it('reads watched.json, and undefined when there is none yet', () => {
    expect(reader().readWatched('alpha')).toEqual({
      timestamp: 1,
      values: { a: 'https://a', z: 'https://a' },
    })
    expect(reader().readWatched('near')).toEqual(undefined)
  })

  it('throws for a name that is not a watch', () => {
    expect(() => reader().getWatchPath('beta')).toThrow('Watch not found')
    expect(reader().findWatch('archived')).toEqual(undefined)
  })
})
