import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import type { EntryParameters } from '../../output/types'
import {
  loadProject,
  readSuite,
  selectContracts,
  selectSuiteProjects,
} from './loadProject'

const A = 'eth:0x1111111111111111111111111111111111111111'
const B = 'eth:0x2222222222222222222222222222222222222222'
const C = 'eth:0x3333333333333333333333333333333333333333'
const D = 'eth:0x4444444444444444444444444444444444444444'
const L2 = 'scr:0x5555555555555555555555555555555555555555'

function entry(
  address: string,
  extra: Partial<EntryParameters> = {},
): EntryParameters {
  return {
    type: 'Contract',
    address: ChainSpecificAddress(address),
    template: 'proj/Foo',
    ...extra,
  }
}

describe(selectContracts.name, () => {
  const entries = [
    entry(A),
    entry(B, { template: undefined }),
    entry(C, { unverified: true }),
    entry(D, { type: 'EOA' }),
    entry(L2),
    entry('eth:0x6666666666666666666666666666666666666666'),
    entry('eth:0x7777777777777777777777777777777777777777'),
  ]

  it('keeps verified contracts on the chain that have a committed template', () => {
    expect(
      selectContracts(entries, 'ethereum', {}).map((e) => e.address.toString()),
    ).toEqual([
      A,
      'eth:0x6666666666666666666666666666666666666666',
      'eth:0x7777777777777777777777777777777777777777',
    ])
  })

  it('intersects the suite list with the command-line list, whatever the case or prefix, then applies the limit', () => {
    const selected = selectContracts(entries, 'ethereum', {
      addresses: [
        A,
        B,
        'eth:0x6666666666666666666666666666666666666666',
        '0x7777777777777777777777777777777777777777',
      ],
      onlyAddresses: [
        '0x1111111111111111111111111111111111111111',
        'eth:0x6666666666666666666666666666666666666666',
        '0x7777777777777777777777777777777777777777',
      ],
      limit: 2,
    })
    expect(selected.map((e) => e.address.toString())).toEqual([
      A,
      'eth:0x6666666666666666666666666666666666666666',
    ])
  })
})

describe(selectSuiteProjects.name, () => {
  const suite = readSuite()

  it('ports the research suite: all of scroll, and fixed lists for base and plumenetwork', () => {
    expect(
      suite.projects.map((p) => [p.name, p.chain, p.addresses?.length]),
    ).toEqual([
      ['scroll', 'ethereum', undefined],
      ['base', 'ethereum', 25],
      ['plumenetwork', 'ethereum', 6],
    ])
  })

  it('picks projects by name in the order asked, all by default, and rejects names outside the suite', () => {
    expect(selectSuiteProjects(suite, []).length).toEqual(3)
    expect(
      selectSuiteProjects(suite, ['plumenetwork', 'scroll']).map((p) => p.name),
    ).toEqual(['plumenetwork', 'scroll'])
    expect(() => selectSuiteProjects(suite, ['arbitrum'])).toThrow(
      'arbitrum is not in the suite (suite: scroll, base, plumenetwork)',
    )
  })
})

describe(loadProject.name, () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-benchmark-load-'))
    write('proj/config.jsonc', {
      name: 'proj',
      initialAddresses: [A],
      overrides: {
        [A]: {
          ignoreMethods: ['fromOverride'],
          fields: {
            owner: { handler: { type: 'hardcoded', value: 'override' } },
          },
        },
      },
    })
    write('proj/discovered.json', {
      name: 'proj',
      timestamp: 1_700_000_000,
      usedBlockNumbers: { ethereum: 1234, scroll: 99 },
      entries: [entry(A)],
    })
    write('_templates/proj/Foo/template.jsonc', {
      ignoreMethods: ['fromTemplate'],
      fields: {
        owner: { handler: { type: 'call', method: 'owner', args: [] } },
        sequencers: {
          handler: {
            type: 'event',
            select: 'account',
            add: { event: 'UpdateSequencer' },
          },
        },
      },
    })
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  function write(file: string, content: unknown) {
    const full = join(root, file)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, JSON.stringify(content))
  }

  it('reads the committed block and timestamp for the suite chain', () => {
    const project = loadProject(root, { name: 'proj', chain: 'ethereum' })
    expect([project.blockNumber, project.timestamp]).toEqual([
      1234, 1_700_000_000,
    ])
    expect(project.entries.map((e) => e.address.toString())).toEqual([A])
  })

  it('merges the committed template under the address override, as the analyzer did', () => {
    const project = loadProject(root, { name: 'proj', chain: 'ethereum' })
    const config = project.committedConfig({
      ...entry(A),
      template: 'proj/Foo',
    })
    expect(config.fields.owner?.handler).toEqual({
      type: 'hardcoded',
      value: 'override',
    })
    expect(config.fields.sequencers?.handler?.type).toEqual('event')
    expect([...config.ignoreMethods].sort()).toEqual([
      'fromOverride',
      'fromTemplate',
    ])
  })

  it('gives the analyzer the override alone, since the template is the thing hidden', () => {
    const project = loadProject(root, { name: 'proj', chain: 'ethereum' })
    const config = project.entryConfig(ChainSpecificAddress(A))
    expect(Object.keys(config.fields)).toEqual(['owner'])
    expect(config.ignoreMethods).toEqual(['fromOverride'])
  })

  it('refuses a chain the committed discovery was not read on', () => {
    expect(() => loadProject(root, { name: 'proj', chain: 'base' })).toThrow(
      'proj/discovered.json has no usedBlockNumbers entry for base (has: ethereum, scroll)',
    )
  })
})
