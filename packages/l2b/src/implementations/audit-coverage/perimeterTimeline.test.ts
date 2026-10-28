import type { DiscoveryOutput, EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildPerimeterTimeline,
  codeAt,
  parsePastUpgrades,
  perimeterAt,
} from './perimeterTimeline'

const A = ChainSpecificAddress('eth:0x000000000000000000000000000000000000000A')
const B = ChainSpecificAddress('eth:0x000000000000000000000000000000000000000B')
const C = ChainSpecificAddress('eth:0x000000000000000000000000000000000000000C')
const I1 = ChainSpecificAddress(
  'eth:0x0000000000000000000000000000000000000011',
)
const I2 = ChainSpecificAddress(
  'eth:0x0000000000000000000000000000000000000012',
)

const iso = (t: number) => new Date(t * 1000).toISOString()

describe(buildPerimeterTimeline.name, () => {
  it('selects critical contracts with their windows and implementation history', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'Proxy',
          sinceTimestamp: 1000000,
          critical: true,
          values: {
            $implementation: I2,
            $pastUpgrades: [
              [iso(1000000), '0x1', [I1]],
              [iso(5000000), '0x2', [I2]],
            ],
          },
        }),
        entry({
          address: B,
          name: 'Windowed',
          sinceTimestamp: 500000,
          critical: { sinceTimestamp: 3000000, untilTimestamp: 7000000 },
        }),
        entry({ address: C, name: 'NotCritical', sinceTimestamp: 100000 }),
      ]),
      undefined,
    )
    expect(timeline.launch).toEqual(1000000)
    expect(timeline.warnings).toEqual([])
    expect(timeline.members).toEqual([
      {
        address: A,
        name: 'Proxy',
        since: 1000000,
        code: [
          { from: 1000000, addresses: [A, I1] },
          { from: 5000000, addresses: [A, I2] },
        ],
      },
      {
        address: B,
        name: 'Windowed',
        since: 3000000,
        until: 7000000,
        code: [{ from: 3000000, addresses: [B] }],
      },
    ])
  })

  it('takes every contract when none is critical', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({ address: A, name: 'A', sinceTimestamp: 200000 }),
        entry({ address: B, name: 'B', sinceTimestamp: 100000 }),
      ]),
      undefined,
    )
    expect(timeline.launch).toEqual(100000)
    expect(timeline.members.map((m) => [m.name, m.since])).toEqual([
      ['B', 100000],
      ['A', 200000],
    ])
  })

  it('collapses history before the launch and drops members gone before it', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'Proxy',
          sinceTimestamp: 1000000,
          critical: true,
          values: {
            $implementation: I2,
            $pastUpgrades: [
              [iso(1000000), '0x1', [I1]],
              [iso(5000000), '0x2', [I2]],
            ],
          },
        }),
        entry({
          address: B,
          name: 'Gone',
          sinceTimestamp: 100000,
          critical: { untilTimestamp: 2000000 },
        }),
      ]),
      6000000,
    )
    expect(timeline.launch).toEqual(6000000)
    expect(timeline.members).toEqual([
      {
        address: A,
        name: 'Proxy',
        since: 6000000,
        code: [{ from: 6000000, addresses: [A, I2] }],
      },
    ])
  })

  it('falls back to the current implementations when the record ends elsewhere', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'Proxy',
          sinceTimestamp: 1000000,
          critical: true,
          values: {
            $implementation: I2,
            $pastUpgrades: [[iso(1000000), '0x1', [I1]]],
          },
        }),
        entry({
          address: B,
          name: 'Unrecorded',
          sinceTimestamp: 1000000,
          critical: true,
          values: { $implementation: I1 },
        }),
      ]),
      undefined,
    )
    expect(timeline.warnings.length).toEqual(1)
    expect(timeline.warnings[0]).toInclude('Proxy')
    expect(timeline.members[0]?.code).toEqual([
      { from: 1000000, addresses: [A, I2] },
    ])
    expect(timeline.members[1]?.code).toEqual([
      { from: 1000000, addresses: [B, I1] },
    ])
  })

  it('folds the launch rollout into the launch', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'First',
          sinceTimestamp: 1000,
          critical: true,
        }),
        entry({
          address: B,
          name: 'SameDay',
          sinceTimestamp: 1000 + 20 * 3600,
          critical: true,
          values: {
            $implementation: I2,
            $pastUpgrades: [
              [iso(1000 + 20 * 3600), '0x1', [I1]],
              [iso(1000 + 30 * 3600), '0x2', [I2]],
            ],
          },
        }),
        entry({
          address: C,
          name: 'Later',
          sinceTimestamp: 1000 + 30 * 3600,
          critical: true,
        }),
      ]),
      1000,
    )
    expect(timeline.members.map((m) => [m.name, m.since])).toEqual([
      ['First', 1000],
      ['SameDay', 1000],
      ['Later', 1000 + 30 * 3600],
    ])
    expect(timeline.members[1]?.code).toEqual([
      { from: 1000, addresses: [B, I1] },
      { from: 1000 + 30 * 3600, addresses: [B, I2] },
    ])
  })

  it('runs the code set during the rollout from the launch', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'Proxy',
          sinceTimestamp: 1000,
          critical: true,
          values: {
            $implementation: I2,
            $pastUpgrades: [
              [iso(1000 + 120), '0x1', [I1]],
              [iso(1000 + 2 * 86400), '0x2', [I2]],
            ],
          },
        }),
      ]),
      1000,
    )
    expect(timeline.members[0]?.code).toEqual([
      { from: 1000, addresses: [A, I1] },
      { from: 1000 + 2 * 86400, addresses: [A, I2] },
    ])
  })

  it('makes a contract without deployment time a member from the launch', () => {
    const timeline = buildPerimeterTimeline(
      discovery([
        entry({
          address: A,
          name: 'A',
          sinceTimestamp: 1000000,
          critical: true,
        }),
        entry({ address: B, name: 'B', critical: true }),
      ]),
      undefined,
    )
    expect(timeline.warnings.length).toEqual(1)
    expect(timeline.members.map((m) => [m.name, m.since])).toEqual([
      ['A', 1000000],
      ['B', 1000000],
    ])
  })
})

describe(perimeterAt.name, () => {
  const timeline = buildPerimeterTimeline(
    discovery([
      entry({
        address: A,
        name: 'Proxy',
        sinceTimestamp: 1000000,
        critical: true,
        values: {
          $implementation: I2,
          $pastUpgrades: [
            [iso(1000000), '0x1', [I1]],
            [iso(5000000), '0x2', [I2]],
          ],
        },
      }),
      entry({
        address: B,
        name: 'Windowed',
        sinceTimestamp: 500000,
        critical: { sinceTimestamp: 3000000, untilTimestamp: 7000000 },
        values: { $implementation: I2 },
      }),
    ]),
    undefined,
  )

  it('includes since and excludes until, and switches code at the upgrade', () => {
    expect(perimeterAt(timeline.members, 2990000).addresses).toEqual([A, I1])
    expect(perimeterAt(timeline.members, 3000000).addresses).toEqual([
      A,
      I1,
      B,
      I2,
    ])
    expect(perimeterAt(timeline.members, 5000000).addresses).toEqual([A, I2, B])
    expect(perimeterAt(timeline.members, 6990000).members.length).toEqual(2)
    expect(perimeterAt(timeline.members, 7000000).members.length).toEqual(1)
  })

  it('gives the code in force at a moment', () => {
    const proxy = timeline.members[0] as (typeof timeline.members)[number]
    expect(codeAt(proxy, 4990000).from).toEqual(1000000)
    expect(codeAt(proxy, 5000000).from).toEqual(5000000)
  })
})

describe(parsePastUpgrades.name, () => {
  it('parses, keeps the last record of a transaction and sorts', () => {
    expect(
      parsePastUpgrades([
        [iso(500), '0xB', [I2]],
        [iso(100), '0xa', [I1]],
        [iso(100), '0xA', [I2]],
        ['not a date', '0xc', []],
        [iso(300), '', [I1]],
      ]),
    ).toEqual([
      { timestamp: 100, transaction: '0xa', implementations: [I2] },
      { timestamp: 300, transaction: undefined, implementations: [I1] },
      { timestamp: 500, transaction: '0xb', implementations: [I2] },
    ])
  })
})

function discovery(entries: EntryParameters[]): DiscoveryOutput {
  return { name: 'p', entries } as unknown as DiscoveryOutput
}

function entry(
  fields: Partial<EntryParameters> & { address: ChainSpecificAddress },
): EntryParameters {
  return { type: 'Contract', ...fields } as EntryParameters
}
