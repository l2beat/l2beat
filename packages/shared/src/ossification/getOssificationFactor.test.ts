import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  DiscoveryChangelogContract,
  DiscoveryChangelogEntry,
} from '../tools/DiscoveryChangelog'
import {
  exploitAgePercentile,
  getOssificationFactor,
  type OssificationContractInput,
  toDisplayScore,
} from './getOssificationFactor'

const scoreAt = (ageSeconds: number) =>
  Math.round(100 * exploitAgePercentile(ageSeconds))

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

function entry(
  overrides: Partial<OssificationContractInput> = {},
): OssificationContractInput {
  return {
    address: ADDRESS_A,
    name: 'Example',
    isVerified: true,
    upgradeTimestamps: [],
    // the field changed by highSeverityChange(), HIGH in current metadata
    highSeverityFields: ['trustedImages'],
    ...overrides,
  }
}

function update(
  timestamp: number,
  changes: DiscoveryChangelogContract[],
  overrides: Partial<DiscoveryChangelogEntry> = {},
): DiscoveryChangelogEntry {
  return {
    id: `update-${timestamp}`,
    timestamp,
    changes,
    ...overrides,
  }
}

/** Changes the field entry() marks HIGH in current metadata. */
function highSeverityChange(address: string): DiscoveryChangelogContract {
  return {
    address,
    fields: [
      {
        key: 'values.trustedImages.0',
        removed: ['"0xaa"'],
        added: ['"0xbb"'],
      },
    ],
  }
}

function implementationChange(address: string): DiscoveryChangelogContract {
  return {
    address,
    fields: [
      {
        key: 'values.$implementation',
        removed: [`"${ADDRESS_E}"`],
        added: [`"${ADDRESS_B}"`],
      },
    ],
  }
}

function pastUpgradeChange(address: string): DiscoveryChangelogContract {
  return {
    address,
    fields: [
      {
        key: 'values.$pastUpgrades.10',
        added: ['["2026-04-21T03:26:47.000Z","0x123",["eth:0x111"]]'],
      },
      {
        key: 'values.$pastUpgrades.11',
        added: ['["2026-04-21T03:26:47.000Z","0x123",["eth:0x222"]]'],
      },
    ],
  }
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
    // the empirical percentile of a 4y-old perimeter (dataset 2026-08)
    expect(result?.score).toEqual(scoreAt(4 * YEAR))
    expect(result?.score ?? 0).toBeGreaterThan(90)
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalChangesPerYear).toEqual(0)
    expect(result?.contracts[0]?.codeChangeCount).toEqual(0)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
  })

  it('resets the clock on a proxy upgrade and skips the initial deployment', () => {
    const result = getOssificationFactor(
      [entry({ upgradeTimestamps: [NOW - 4 * YEAR, NOW - 2 * YEAR] })],
      [],
      NOW,
    )
    expect(result?.score).toEqual(scoreAt(2 * YEAR))
    expect(result?.lastCriticalChange).toEqual(NOW - 2 * YEAR)
    expect(result?.contracts[0]?.codeChangeCount).toEqual(1)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('counts the first upgrade when it changed an initialized proxy', () => {
    const result = getOssificationFactor(
      [
        entry({
          upgradeTimestamps: [NOW - 2 * YEAR],
          firstUpgradeIsInitialization: false,
        }),
      ],
      [],
      NOW,
    )

    expect(result?.lastCriticalChange).toEqual(NOW - 2 * YEAR)
    expect(result?.contracts[0]?.codeChangeCount).toEqual(1)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('counts a reviewed event missing from discovery history', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
      [],
      [
        {
          timestamp: NOW - 30 * DAY,
          type: 'state',
          source: 'tx:0xreviewed',
          reason: 'Changed a security-critical setting.',
          contract: ADDRESS_A,
          updateId: 'reviewed-update',
        },
      ],
    )

    expect(result?.projectClockStart).toEqual(NOW - 30 * DAY)
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
    expect(result?.clusteredEventCount).toEqual(1)
    expect(result?.criticalUpdates).toEqual([
      { id: 'reviewed-update', type: 'state' },
    ])
  })

  it('keeps a reviewed historical event out of the current clock', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - YEAR })],
      [],
      NOW,
      [
        {
          address: ADDRESS_B,
          name: 'Old implementation',
          upgradeTimestamps: [],
        },
      ],
      [
        {
          timestamp: NOW - 30 * DAY,
          type: 'state',
          source: 'tx:0xhistorical',
          reason: 'Changed a historical security-critical setting.',
          contract: ADDRESS_B,
          historical: true,
        },
      ],
    )

    expect(result?.projectClockStart).toEqual(NOW - YEAR)
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('ignores an attributed reviewed event outside the perimeter', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - YEAR })],
      [],
      NOW,
      [],
      [
        {
          timestamp: NOW - 30 * DAY,
          type: 'state',
          source: 'tx:0xoutside',
          reason: 'Changed a setting outside the perimeter.',
          contract: ADDRESS_B,
          updateId: 'outside-perimeter',
        },
      ],
    )

    expect(result?.projectClockStart).toEqual(NOW - YEAR)
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalUpdates).toEqual([])
  })

  it('uses a deployment newer than the initial implementation event', () => {
    const result = getOssificationFactor(
      [
        entry({
          sinceTimestamp: NOW - YEAR,
          upgradeTimestamps: [NOW - 2 * YEAR],
        }),
      ],
      [],
      NOW,
    )
    expect(result?.projectClockStart).toEqual(NOW - YEAR)
    expect(result?.contracts[0]?.codeChangeCount).toEqual(0)
  })

  it('counts a high-severity value change from diff history', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
    expect(result?.contracts[0]?.codeChangeCount).toEqual(0)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
    expect(result?.criticalUpdates).toEqual([
      { id: `update-${NOW - 30 * DAY}`, type: 'state' },
    ])
    expect(result?.projectAgeSeconds).toEqual(30 * DAY)
    expect(result?.score).toEqual(scoreAt(30 * DAY))
    // a 30d-old perimeter is younger than most exploited code
    expect(result?.score ?? 100).toBeLessThan(50)
  })

  it('ignores implementation-change diffs when $pastUpgrades covers them', () => {
    const result = getOssificationFactor(
      [entry({ upgradeTimestamps: [NOW - 3 * YEAR] })],
      [update(NOW - 30 * DAY, [implementationChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.contracts[0]?.codeChangeCount).toEqual(0)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalUpdates).toEqual([
      { id: `update-${NOW - 30 * DAY}`, type: 'code' },
    ])
  })

  it('tags an upgrade-and-restore update from appended $pastUpgrades', () => {
    const upgradeTimestamp = NOW - 31 * DAY
    const result = getOssificationFactor(
      [
        entry({
          upgradeTimestamps: [NOW - 3 * YEAR, upgradeTimestamp],
        }),
      ],
      [update(NOW - 30 * DAY, [pastUpgradeChange(ADDRESS_A)])],
      NOW,
    )

    expect(result?.criticalUpdates).toEqual([
      { id: `update-${NOW - 30 * DAY}`, type: 'code' },
    ])
    expect(result?.contracts[0]?.codeChangeCount).toEqual(1)
    expect(result?.lastCriticalChange).toEqual(upgradeTimestamp)
  })

  it('uses implementation-change diffs for proxies without $pastUpgrades', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [implementationChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.contracts[0]?.codeChangeCount).toEqual(1)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
  })

  it('classifies a mixed diff update as one code change', () => {
    const result = getOssificationFactor(
      [
        entry({
          upgradeTimestamps: [NOW - 4 * YEAR, NOW - 30 * DAY],
        }),
      ],
      [
        update(NOW - 30 * DAY, [
          implementationChange(ADDRESS_A),
          highSeverityChange(ADDRESS_A),
        ]),
      ],
      NOW,
    )
    expect(result?.contracts[0]?.codeChangeCount).toEqual(1)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.criticalUpdates).toEqual([
      { id: `update-${NOW - 30 * DAY}`, type: 'code' },
    ])
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
        update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)]),
        update(NOW - 30 * DAY + 60 * 60, [highSeverityChange(ADDRESS_B)]),
        update(NOW - 10 * DAY, [highSeverityChange(ADDRESS_A)]),
      ],
      NOW,
    )
    expect(result?.clusteredEventCount).toEqual(2)
  })

  it('marks a newly deployed critical contract as a perimeter reset', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 30 * DAY,
        }),
      ],
      [],
      NOW,
    )
    // The deployment moved the clock, so the timeline has to show it, but it is
    // not a change and never counts toward the rate.
    expect(result?.projectClockStart).toEqual(NOW - 30 * DAY)
    expect(result?.clusteredEventCount).toEqual(0)
    expect(result?.perimeterResets).toEqual([NOW - 4 * YEAR, NOW - 30 * DAY])
  })

  it('clusters a deployment and a change on the same day into one reset', () => {
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 30 * DAY,
        }),
      ],
      [update(NOW - 30 * DAY + 60 * 60, [highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.perimeterResets).toEqual([NOW - 4 * YEAR, NOW - 30 * DAY])
  })

  it('matches legacy diff entries with bare addresses', () => {
    const bareAddress = ADDRESS_A.split(':')[1] ?? ''
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(bareAddress)])],
      NOW,
    )
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
  })

  it('matches chain prefixes containing hyphens', () => {
    const address = ADDRESS_A.replace('eth:', 'arb-nova:')
    const result = getOssificationFactor(
      [entry({ address, sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(address)])],
      NOW,
    )
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
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
    expect(result?.maturity).toEqual(0)
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
    // a verified perimeter never displays 0 — that value is reserved for the
    // unverified gate
    expect(result?.score).toEqual(1)
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
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.projectClockStart).toEqual(NOW - 30 * DAY)
    expect(result?.projectAgeSeconds).toEqual(30 * DAY)
    expect(result?.score).toEqual(scoreAt(30 * DAY))
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
    expect(result?.score).toEqual(scoreAt(4 * YEAR))
    expect(result?.contracts.length ?? 0).toEqual(1)
    // events from the removed contract still count
    expect(result?.lastCriticalChange).toEqual(NOW - 1 * YEAR)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('never attaches diff history to historical contracts', () => {
    // historical contracts are a closed reviewed ledger: upgrade timestamps
    // plus reviewed events; annotated diff blocks on their addresses are inert
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_B)])],
      NOW,
      [{ address: ADDRESS_B, name: 'OldVerifier', upgradeTimestamps: [] }],
    )
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalUpdates).toEqual([])
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
  })

  it('ignores an annotated-HIGH diff on a field no longer HIGH today', () => {
    // the annotation is a frozen snapshot; the current judgment wins
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR, highSeverityFields: [] })],
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.projectAgeSeconds).toEqual(4 * YEAR)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.lastCriticalChange).toEqual(null)
    expect(result?.criticalUpdates).toEqual([])
  })

  it('counts a diff on a field that is HIGH today regardless of past annotations', () => {
    // the changelog carries no severity snapshots at all — only the current
    // fieldMeta judgment decides, in both directions
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
  })

  it('evaluates a legacy upgradeability.admin diff against the $admin field', () => {
    const legacyAdminChange: DiscoveryChangelogContract = {
      address: ADDRESS_A,
      fields: [
        {
          key: 'upgradeability.admin',
          removed: [`"${ADDRESS_B}"`],
          added: [`"${ADDRESS_C}"`],
        },
      ],
    }
    const result = getOssificationFactor(
      [
        entry({
          sinceTimestamp: NOW - 4 * YEAR,
          highSeverityFields: ['$admin'],
        }),
      ],
      [update(NOW - 30 * DAY, [legacyAdminChange])],
      NOW,
    )
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
  })

  it('dates state diffs at the onchain upgrade bundled in the same update', () => {
    const onchainTimestamp = NOW - 32 * DAY
    const iso = new Date(onchainTimestamp * 1000).toISOString()
    const bundledUpgrade: DiscoveryChangelogContract = {
      address: ADDRESS_B,
      fields: [
        {
          key: 'values.$pastUpgrades.3',
          added: [`["${iso}","0xabc",["eth:0x111"]]`],
        },
      ],
    }
    const result = getOssificationFactor(
      [
        entry({ sinceTimestamp: NOW - 4 * YEAR }),
        entry({
          address: ADDRESS_B,
          name: 'Other',
          sinceTimestamp: NOW - 4 * YEAR,
          upgradeTimestamps: [NOW - 5 * YEAR, onchainTimestamp],
        }),
      ],
      [update(NOW - 30 * DAY, [bundledUpgrade, highSeverityChange(ADDRESS_A)])],
      NOW,
    )
    // the state change and the upgrade form one 24h cluster at onchain time
    expect(result?.lastCriticalChange).toEqual(onchainTimestamp)
    expect(result?.projectClockStart).toEqual(onchainTimestamp)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('keeps the review timestamp when an appended upgrade is a stale backfill', () => {
    // pastUpgradeChangeBlock appends entries months before the update — a
    // handler backfill, not a fresh observation
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [
        update(NOW - 30 * DAY, [
          pastUpgradeChange(ADDRESS_B),
          highSeverityChange(ADDRESS_A),
        ]),
      ],
      NOW,
    )
    expect(result?.lastCriticalChange).toEqual(NOW - 30 * DAY)
  })

  it('lets a reviewed event supersede its update for the same contract', () => {
    const onchainTimestamp = NOW - 33 * DAY
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [highSeverityChange(ADDRESS_A)])],
      NOW,
      [],
      [
        {
          timestamp: onchainTimestamp,
          type: 'state',
          source: 'tx:0xreviewed',
          reason: 'Changed trusted images.',
          contract: ADDRESS_A,
          updateId: `update-${NOW - 30 * DAY}`,
        },
      ],
    )
    // one event at the reviewed onchain time, not two (reviewed + review-time)
    expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
    expect(result?.lastCriticalChange).toEqual(onchainTimestamp)
    expect(result?.projectClockStart).toEqual(onchainTimestamp)
    expect(result?.clusteredEventCount).toEqual(1)
  })

  it('ignores representation-only rewrites of a HIGH field', () => {
    // chain-prefix migration: the value did not change onchain
    const prefixMigration: DiscoveryChangelogContract = {
      address: ADDRESS_A,
      fields: [
        {
          key: 'values.trustedImages.0',
          removed: ['"0xaAbB00000000000000000000000000000000CdEf"'],
          added: ['"eth:0xaAbB00000000000000000000000000000000CdEf"'],
        },
      ],
    }
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [update(NOW - 30 * DAY, [prefixMigration])],
      NOW,
    )
    expect(result?.contracts[0]?.stateChangeCount).toEqual(0)
    expect(result?.lastCriticalChange).toEqual(null)
  })

  it('ignores historical entries that shadow a live contract', () => {
    const result = getOssificationFactor(
      [entry({ sinceTimestamp: NOW - 4 * YEAR })],
      [],
      NOW,
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

  /** A perimeter can be older than the project using it: an OP-stack chain
   *  adopts a SuperchainConfig that has been upgraded for years, a chain
   *  launches weeks after its contracts were deployed. Those changes are not
   *  this project's doing. */
  describe('project start', () => {
    /** Deployed and upgraded long before the project, then again after it. */
    const sharedEntry = entry({
      address: ADDRESS_B,
      name: 'SharedConfig',
      sinceTimestamp: NOW - 4 * YEAR,
      upgradeTimestamps: [NOW - 4 * YEAR, NOW - 2.5 * YEAR, NOW - YEAR],
    })
    const ownEntry = entry({
      address: ADDRESS_A,
      sinceTimestamp: NOW - 2 * YEAR,
    })
    const PROJECT_START = NOW - 2 * YEAR

    it('charges changes made before the project existed to nobody', () => {
      const before = getOssificationFactor([sharedEntry, ownEntry], [], NOW)
      expect(before?.clusteredEventCount).toEqual(2)

      const result = getOssificationFactor(
        [sharedEntry, ownEntry],
        [],
        NOW,
        [],
        [],
        PROJECT_START,
      )
      // only the upgrade the project actually lived through
      expect(result?.clusteredEventCount).toEqual(1)
      expect(
        result?.contracts.find((c) => c.address === ADDRESS_B)?.codeChangeCount,
      ).toEqual(1)
    })

    it('starts the rate window at the project, not at the oldest contract', () => {
      const before = getOssificationFactor([sharedEntry, ownEntry], [], NOW)
      // clipped to the 3y window by the older contract's history
      expect(before?.windowSeconds).toEqual(3 * YEAR)
      expect(before?.criticalChangesPerYear).toEqual(2 / 3)

      const result = getOssificationFactor(
        [sharedEntry, ownEntry],
        [],
        NOW,
        [],
        [],
        PROJECT_START,
      )
      // one event over the two years the project has existed
      expect(result?.windowSeconds).toEqual(2 * YEAR)
      expect(result?.criticalChangesPerYear).toEqual(0.5)
    })

    it('keeps the age of a contract older than the project', () => {
      const result = getOssificationFactor(
        [sharedEntry, ownEntry],
        [],
        NOW,
        [],
        [],
        PROJECT_START,
      )
      // the shared contract's clock is its real last change, and the timeline
      // still shows every reset behind the clocks
      expect(
        result?.contracts.find((c) => c.address === ADDRESS_B)?.clockStart,
      ).toEqual(NOW - YEAR)
      expect(result?.lastCriticalChange).toEqual(NOW - YEAR)
      expect(result?.perimeterResets ?? []).toInclude(NOW - 2.5 * YEAR)
    })

    it('keeps a reviewed event that a researcher attributed by hand', () => {
      const result = getOssificationFactor(
        [ownEntry],
        [],
        NOW,
        [],
        [
          {
            timestamp: PROJECT_START - DAY,
            type: 'state',
            source: 'tx:0xreviewed',
            reason: 'Deployment-time setup the reviewer counted deliberately.',
            contract: ADDRESS_A,
          },
        ],
        PROJECT_START,
      )
      expect(result?.contracts[0]?.stateChangeCount).toEqual(1)
    })
  })
})

describe(toDisplayScore.name, () => {
  it('reserves 0 for the unverified gate and never fakes the extremes', () => {
    expect(toDisplayScore(0)).toEqual(0)
    expect(toDisplayScore(0.0001)).toEqual(1)
    expect(toDisplayScore(0.5)).toEqual(50)
    expect(toDisplayScore(0.999)).toEqual(99)
    expect(toDisplayScore(1)).toEqual(99)
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
  }
  const timelock: DiscoveredEntryLite = {
    type: 'Contract',
    address: ADDRESS_E,
    name: 'Timelock',
  }
  const adminUpgradesPool = {
    [ADDRESS_D]: {
      receivedPermissions: [{ from: ADDRESS_A, via: [{ address: ADDRESS_E }] }],
    },
  }

  it('closes over value references and permission holders, excluding periphery', () => {
    const perimeter = deriveOssificationPerimeter(
      [pool, verifier, governance, admin, timelock],
      [ADDRESS_A],
      adminUpgradesPool,
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
    }
    const perimeter = deriveOssificationPerimeter(
      [pool, verifier, eoa],
      [ADDRESS_A],
      { [ADDRESS_C]: { receivedPermissions: [{ from: ADDRESS_A }] } },
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
