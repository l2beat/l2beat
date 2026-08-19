import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryUpdate } from '../recent-changes/getDiscoveryUpdates'
import {
  getOssificationFactor,
  type OssificationEntry,
} from './getOssificationFactor'
import {
  collectEscrowSeeds,
  type DiscoveredEntryLite,
  deriveOssificationPerimeter,
} from './getOssificationPerimeter'

const NOW = UnixTime(1_800_000_000)
const YEAR = 365 * 24 * 60 * 60
const DAY = 24 * 60 * 60

const ADDRESS_A = 'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
const ADDRESS_B = 'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b'
const ADDRESS_C = 'eth:0x0ffa4A625ED9DB32B70F99180FD00759fc3e9261'
const ADDRESS_D = 'eth:0x6f21C543a4aF5189eBdb0723827577e1EF57ef1f'
const ADDRESS_E = 'eth:0x64523f2580f4E7038a121D55b220a9C12C1E8f01'

function entry(overrides: Partial<OssificationEntry> = {}): OssificationEntry {
  return {
    address: ADDRESS_A,
    name: 'Example',
    isVerified: true,
    upgradeTimestamps: [],
    ...overrides,
  }
}

function update(
  timestamp: number,
  body: string,
  overrides: Partial<DiscoveryUpdate> = {},
): DiscoveryUpdate {
  return {
    id: `update-${timestamp}`,
    date: new Date(timestamp * 1000).toUTCString(),
    timestamp,
    description: '',
    isHighSeverity: true,
    changeCount: 1,
    sections: [{ kind: 'watched-changes', body }],
    ...overrides,
  }
}

function highSeverityBlock(address: string): string {
  return [
    '```diff',
    `    contract Example (${address}) {`,
    '    +++ description: test contract',
    '+++ description: trusted keys',
    '+++ severity: HIGH',
    '      values.trustedImages.0:',
    '-        "0xaa"',
    '+        "0xbb"',
    '    }',
    '```',
  ].join('\n')
}

function implementationChangeBlock(address: string): string {
  return [
    '```diff',
    `    contract Example (${address}) {`,
    '    +++ description: test contract',
    '      values.$implementation:',
    `-        "${ADDRESS_E}"`,
    `+        "${ADDRESS_B}"`,
    '    }',
    '```',
  ].join('\n')
}

describe(getOssificationFactor.name, () => {
  it('returns undefined without entries', () => {
    expect(getOssificationFactor([], [], NOW)).toEqual(undefined)
  })

  it('returns undefined when no contract has a known age', () => {
    expect(getOssificationFactor([entry()], [], NOW)).toEqual(undefined)
  })

  it('scores an old unchanged contract as mature', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
    )
    // m(4y) = 1 - e^-2 = 0.8647
    expect(result?.score).toEqual(86)
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalChangesPerYear).toEqual(0)
    expect(result?.contracts[0]?.hasChanged).toEqual(false)
  })

  it('resets the clock on a proxy upgrade and skips the initial deployment', () => {
    const result = getOssificationFactor(
      [entry({ upgradeTimestamps: [NOW - 4 * YEAR, NOW - 2 * YEAR] })],
      [],
      NOW,
    )
    // m(2y) = 1 - e^-1 = 0.632
    expect(result?.score).toEqual(63)
    expect(result?.lastCriticalChange).toEqual(NOW - 2 * YEAR)
    expect(result?.contracts[0]?.criticalChangeCount).toEqual(1)
    expect(result?.contracts[0]?.hasChanged).toEqual(true)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('counts a high-severity value change from diff history', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, highSeverityBlock(ADDRESS_A))],
      NOW,
    )
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
    expect(result?.contracts[0]?.criticalChangeCount).toEqual(1)
    expect(result?.projectAgeSeconds).toEqual(30 * DAY)
    // m(30d) is tiny
    expect(result?.score ?? 100).toBeLessThan(10)
  })

  it('ignores implementation-change diffs when $pastUpgrades covers them', () => {
    const result = getOssificationFactor(
      [entry({ upgradeTimestamps: [NOW - 3 * YEAR] })],
      [update(NOW - 30 * DAY, implementationChangeBlock(ADDRESS_A))],
      NOW,
    )
    expect(result?.contracts[0]?.criticalChangeCount).toEqual(0)
    expect(result?.lastCriticalChange).toEqual(null)
  })

  it('uses implementation-change diffs for proxies without $pastUpgrades', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, implementationChangeBlock(ADDRESS_A))],
      NOW,
    )
    expect(result?.contracts[0]?.criticalChangeCount).toEqual(1)
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
  })

  it('clusters events within 24 hours into a single event', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 4 * YEAR,
        }),
      ],
      [
        update(NOW - 30 * DAY, highSeverityBlock(ADDRESS_A)),
        update(NOW - 30 * DAY + 60 * 60, highSeverityBlock(ADDRESS_B)),
        update(NOW - 10 * DAY, highSeverityBlock(ADDRESS_A)),
      ],
      NOW,
    )
    expect(result?.clusteredEventCount).toEqual(2)
  })

  it('matches legacy diff entries with bare addresses', () => {
    const bareAddress = ADDRESS_A.split(':')[1] ?? ''
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, highSeverityBlock(bareAddress))],
      NOW,
    )
    expect(result?.contracts[0]?.criticalChangeCount).toEqual(1)
  })

  it('scores the whole perimeter as zero when a critical contract is unverified', () => {
    const result = getOssificationFactor(
      [
        entry({ isVerified: false, sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 4 * YEAR,
        }),
      ],
      [],
      NOW,
    )
    expect(result?.score).toEqual(0)
    expect(result?.contracts[0]?.maturity).toEqual(0)
  })

  it('uses the newest critical contract clock for the whole project', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW,
        }),
      ],
      [],
      NOW,
    )
    expect(result?.score).toEqual(0)
    expect(result?.projectClockStart).toEqual(NOW)
    expect(result?.projectAgeSeconds).toEqual(0)
  })

  it('applies a change in any critical contract to the whole project', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 4 * YEAR,
        }),
      ],
      [update(NOW - 30 * DAY, highSeverityBlock(ADDRESS_A))],
      NOW,
    )
    expect(result?.projectClockStart).toEqual(NOW - 30 * DAY)
    expect(result?.projectAgeSeconds).toEqual(30 * DAY)
    expect(result?.score ?? 100).toBeLessThan(10)
  })

  it('expresses maturity against current project TVS in USD', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
      100,
    )
    const maturity = 1 - Math.exp(-2)
    expect(result?.currentTvs).toEqual(100)
    expect(result?.maturity).toEqual(maturity)
    expect(result?.implicitBugBounty).toEqual(100 * maturity)
  })

  it('does not score a perimeter with an unknown contract clock', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({ address: ADDRESS_B, name: 'Unknown' }),
      ],
      [],
      NOW,
    )
    expect(result).toEqual(undefined)
  })

  it('counts backfilled historical events without touching the project clock', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
      undefined,
      [
        {
          address: ADDRESS_B,
          name: 'OldInbox',
          // initial deployment + two upgrades, one inside the 3y rate window
          upgradeTimestamps: [NOW - 5 * YEAR, NOW - 4 * YEAR, NOW - 1 * YEAR],
        },
      ],
    )
    // clock and score come from the live perimeter only
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
    expect(result?.score).toEqual(86)
    expect(result?.contracts.length ?? 0).toEqual(1)
    // events from the removed contract still count
    expect(result?.lastCriticalChange).toEqual(NOW - 1 * YEAR)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('attributes diff history to backfilled historical addresses', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, highSeverityBlock(ADDRESS_B))],
      NOW,
      undefined,
      [{ address: ADDRESS_B, name: 'OldVerifier', upgradeTimestamps: [] }],
    )
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
  })

  it('ignores historical entries that shadow a live contract', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
      undefined,
      [
        {
          address: ADDRESS_A,
          name: 'Example',
          upgradeTimestamps: [NOW - 5 * YEAR, NOW - 1 * YEAR],
        },
      ],
    )
    expect(result?.lastCriticalChange).toEqual(null)
  })
})

describe(deriveOssificationPerimeter.name, () => {
  const pool: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_A,
    name: 'Pool',
    values: { verifier: ADDRESS_B },
  }
  const verifier: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_B,
    name: 'Verifier',
  }
  const governance: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_C,
    name: 'Governance',
    values: { registry: ADDRESS_E },
  }
  const admin: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_D,
    name: 'AdminMultisig',
    receivedPermissions: [
      { permission: 'upgrade', from: ADDRESS_A, via: [{ address: ADDRESS_E }] },
    ],
  }
  const timelock: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_E,
    name: 'Timelock',
  }

  it('closes over value references and permission holders, excluding periphery', () => {
    const perimeter = deriveOssificationPerimeter(
      [pool, verifier, governance, admin, timelock],
      [ADDRESS_A],
    )
    expect(perimeter).toEqual(
      new Set(
        [ADDRESS_A, ADDRESS_B, ADDRESS_D, ADDRESS_E].map((a) =>
          a.toLowerCase(),
        ),
      ),
    )
  })

  it('does not follow value references curated as severity LOW', () => {
    const poolWithRecipient: DiscoveredEntryLite = {
      type: 'Contract',
      address: ADDRESS_A,
      name: 'Pool',
      values: { verifier: ADDRESS_B, governance: ADDRESS_C },
      fieldMeta: { governance: { severity: 'LOW' } },
    }
    const perimeter = deriveOssificationPerimeter(
      [poolWithRecipient, verifier, governance],
      [ADDRESS_A],
    )
    expect(perimeter?.has(ADDRESS_B.toLowerCase())).toEqual(true)
    expect(perimeter?.has(ADDRESS_C.toLowerCase())).toEqual(false)
  })

  it('does not include EOAs', () => {
    const eoa: DiscoveredEntryLite = {
      type: 'EOA',
      address: ADDRESS_C,
      receivedPermissions: [{ permission: 'upgrade', from: ADDRESS_A }],
    }
    const perimeter = deriveOssificationPerimeter(
      [pool, verifier, eoa],
      [ADDRESS_A],
    )
    expect(perimeter?.has(ADDRESS_C.toLowerCase())).toEqual(false)
  })

  it('returns null when no seed matches a discovered contract', () => {
    expect(deriveOssificationPerimeter([pool], [ADDRESS_C])).toEqual(null)
    expect(deriveOssificationPerimeter([pool], [])).toEqual(null)
  })
})

describe(collectEscrowSeeds.name, () => {
  it('finds escrow addresses in nested amount formulas', () => {
    const seeds = collectEscrowSeeds({
      tokens: [
        {
          amount: {
            type: 'calculation',
            arguments: [
              {
                type: 'balanceOfEscrow',
                chain: 'ethereum',
                escrowAddress: '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
              },
            ],
          },
        },
        {
          amount: {
            type: 'balanceOfEscrow',
            chain: 'unknownchain',
            escrowAddress: '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
          },
        },
      ],
    })
    expect(seeds).toEqual(['eth:0x22aaa7720ddd5388a3c0a3333430953c68f1849b'])
  })
})
