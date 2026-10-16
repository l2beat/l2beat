import type {
  CriticalFlag,
  DiffHistoryChange,
  EntryParameters,
} from '@l2beat/discovery'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getOssificationHistory,
  type OssificationJudgement,
  type OssificationSources,
} from './getOssificationHistory'
import {
  EMPTY_OSSIFICATION_PATCH,
  type OssificationPatch,
} from './OssificationPatch'

const NOW = UnixTime(1_800_000_000)
const DAY = 24 * 60 * 60
const ADDRESS_A = 'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
const ADDRESS_B = 'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b'
const TX_1 = `0x${'1'.repeat(64)}`
const TX_2 = `0x${'2'.repeat(64)}`
const TX_3 = `0x${'3'.repeat(64)}`
const T0 = NOW - 400 * DAY
const RUN_1 = NOW - 100 * DAY
const RUN_2 = NOW - 50 * DAY

const iso = (timestamp: number) => new Date(timestamp * 1000).toISOString()
const pastUpgrades = (
  ...upgrades: [number, string][]
): EntryParameters['values'] => ({
  $pastUpgrades: upgrades.map(([t, tx]) => [iso(t), tx, [ADDRESS_B]]) as never,
})

function entry(overrides: Partial<EntryParameters> = {}): EntryParameters {
  return {
    type: 'Contract',
    address: ChainSpecificAddress(ADDRESS_A),
    name: 'A',
    critical: true,
    sinceTimestamp: T0,
    ...overrides,
  }
}

/** Records of one diffHistory entry, all on one contract. */
function update(
  entryId: string,
  timestamp: number,
  previous: number | undefined,
  address: string,
  records: Partial<DiffHistoryChange>[],
): DiffHistoryChange[] {
  return records.map((record) => ({
    entryId,
    timestamp,
    ...(previous === undefined ? {} : { previous }),
    address: ChainSpecificAddress(address),
    addressType: 'Contract',
    ...record,
  }))
}
const implementation: Partial<DiffHistoryChange> = {
  kind: 'implementation',
  field: '$implementation',
}
const owner: Partial<DiffHistoryChange> = { kind: 'value', field: 'owner' }
const appended = (
  timestamp: number,
  transaction: string,
): Partial<DiffHistoryChange> => ({
  kind: 'upgradeAppended',
  field: '$pastUpgrades',
  upgrade: { timestamp, transaction },
})

function judgement(
  critical: Record<string, CriticalFlag> = {},
  high: string[] = [],
): OssificationJudgement {
  const flags = new Map(
    Object.entries(critical).map(([key, flag]) => [key.toLowerCase(), flag]),
  )
  return {
    critical: (address, template) =>
      flags.get(address.toLowerCase()) ??
      (template === undefined ? undefined : flags.get(template.toLowerCase())),
    highSeverityFields: () => new Set(high),
  }
}

const patch = (overrides: Partial<OssificationPatch>): OssificationPatch => ({
  ...EMPTY_OSSIFICATION_PATCH,
  ...overrides,
})

function derive(overrides: Partial<OssificationSources>) {
  return getOssificationHistory({
    entries: [entry()],
    overrides: [],
    changes: [],
    judgement: judgement(),
    patch: EMPTY_OSSIFICATION_PATCH,
    ...overrides,
  })
}

const rows = (history: ReturnType<typeof derive>) =>
  history?.contracts.map((c) => [
    c.name,
    c.ossifyingSince,
    c.codeChangeCount,
    c.stateChangeCount,
  ])
const changes = (history: ReturnType<typeof derive>) =>
  history?.changes
    .map((c) => [c.type, c.timestamp, c.earliest, c.updateId] as const)
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))

describe(getOssificationHistory.name, () => {
  describe('rows', () => {
    it('are the contracts critical today, with the deployment as their clock', () => {
      const history = derive({
        entries: [
          entry({ unverified: true }),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            critical: undefined,
          }),
        ],
      })
      expect(history?.contracts).toEqual([
        {
          name: 'A',
          address: ChainSpecificAddress(ADDRESS_A),
          isVerified: false,
          ossifyingSince: T0,
          codeChangeCount: 0,
          stateChangeCount: 0,
        },
      ])
      expect(history?.deployments).toEqual([T0])
      expect(history?.observedSince).toEqual(T0)
    })

    it('are absent for a contract whose critical window has closed', () => {
      const history = derive({
        entries: [
          entry(),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            critical: { untilTimestamp: RUN_1 },
          }),
        ],
      })
      expect(rows(history)).toEqual([['A', T0, 0, 0]])
    })

    it('are empty when every contract has retired, and the history stays', () => {
      const history = derive({
        entries: [
          entry({
            critical: { untilTimestamp: RUN_1 },
            values: pastUpgrades([T0, TX_1], [T0 + 10 * DAY, TX_2]),
          }),
        ],
      })
      expect(rows(history)).toEqual([])
      expect(changes(history)).toEqual([
        ['code', T0 + 10 * DAY, T0 + 10 * DAY, undefined],
      ])
    })

    it('are nothing when no contract is critical', () => {
      expect(derive({ entries: [entry({ critical: undefined })] })).toEqual(
        undefined,
      )
    })

    it('refuse a critical contract with no known age', () => {
      expect(() =>
        derive({ entries: [entry({ sinceTimestamp: undefined })] }),
      ).toThrow('no known age')
    })

    it('let a config override win over the discovered flag', () => {
      const history = derive({
        overrides: [
          {
            address: ADDRESS_A.toLowerCase(),
            critical: { untilTimestamp: RUN_1 },
          },
        ],
      })
      expect(rows(history)).toEqual([])
    })

    it('refuse a critical flag on something that is not a contract', () => {
      expect(() => derive({ entries: [entry({ type: 'EOA' })] })).toThrow(
        'not a contract',
      )
    })

    it('refuse an override discovery no longer sees unless it is bounded', () => {
      expect(() =>
        derive({ overrides: [{ address: ADDRESS_B, critical: true }] }),
      ).toThrow('untilTimestamp')
      const history = derive({
        overrides: [
          { address: ADDRESS_B, critical: { untilTimestamp: RUN_1 } },
        ],
      })
      expect(rows(history)).toEqual([['A', T0, 0, 0]])
    })
  })

  describe('$pastUpgrades', () => {
    it('starts the clock at the initialization and counts later upgrades', () => {
      const history = derive({
        entries: [
          entry({
            values: pastUpgrades(
              [T0 + 30 * DAY, TX_2],
              [T0 + DAY, TX_1],
              [T0 + 30 * DAY, TX_2],
            ),
          }),
        ],
      })
      expect(rows(history)).toEqual([['A', T0 + 30 * DAY, 1, 0]])
      expect(changes(history)).toEqual([
        ['code', T0 + 30 * DAY, T0 + 30 * DAY, undefined],
      ])
      expect(history?.deployments).toEqual([T0 + DAY])
    })

    it('drops ignored transactions and upgrades after the contract left', () => {
      const history = derive({
        entries: [
          entry(),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            critical: { untilTimestamp: T0 + 40 * DAY },
            values: pastUpgrades(
              [T0, TX_1],
              [T0 + 30 * DAY, TX_2],
              [T0 + 60 * DAY, TX_3],
            ),
          }),
        ],
        patch: patch({ ignoredTransactions: [TX_2.toUpperCase()] }),
      })
      expect(changes(history)).toEqual([])
    })

    it('lets a reviewed change with the same transaction replace the initialization', () => {
      const history = derive({
        entries: [
          entry({ values: pastUpgrades([T0, TX_1], [T0 + 30 * DAY, TX_2]) }),
        ],
        patch: patch({
          events: [
            {
              timestamp: T0,
              type: 'code',
              contract: ADDRESS_A,
              transaction: TX_1,
              reason: 'a real change',
            },
          ],
        }),
      })
      expect(
        changes(history)?.map(([type, timestamp]) => [type, timestamp]),
      ).toEqual([
        ['code', T0],
        ['code', T0 + 30 * DAY],
      ])
    })

    it('replaces only the reviewed contract when one transaction upgraded two', () => {
      const history = derive({
        entries: [
          entry({ values: pastUpgrades([T0, TX_1], [RUN_1, TX_2]) }),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            name: 'B',
            values: pastUpgrades([T0, TX_1], [RUN_1, TX_2]),
          }),
        ],
        patch: patch({
          events: [
            {
              timestamp: RUN_1,
              type: 'state',
              contract: ADDRESS_A,
              transaction: TX_2,
              reason: 'only a parameter change on A',
            },
          ],
        }),
      })
      expect(rows(history)).toEqual([
        ['A', RUN_1, 0, 1],
        ['B', RUN_1, 1, 0],
      ])
    })
  })

  describe('diff history', () => {
    it('dates appended upgrades onchain and skips ones discovery already has', () => {
      const history = derive({
        entries: [entry({ values: pastUpgrades([T0, TX_1]) })],
        changes: update('u1', RUN_1, T0, ADDRESS_A, [
          appended(T0, TX_1),
          appended(RUN_1 - DAY, TX_2),
          { kind: 'upgradeRecord', field: '$upgradeCount' },
        ]),
      })
      expect(changes(history)).toEqual([
        ['code', RUN_1 - DAY, RUN_1 - DAY, 'u1'],
      ])
    })

    it('keeps an appended upgrade a live sibling already recorded', () => {
      const history = derive({
        entries: [entry({ values: pastUpgrades([T0, TX_1], [RUN_1, TX_2]) })],
        changes: [
          ...update('u1', RUN_1 + DAY, T0, ADDRESS_B, [appended(RUN_1, TX_2)]),
          ...update('u2', RUN_2, RUN_1 + DAY, ADDRESS_B, [
            { status: 'deleted', template: 'x/B' },
          ]),
        ],
        judgement: judgement({ 'x/B': true }),
      })
      expect(changes(history)).toEqual([
        ['code', RUN_1, RUN_1, undefined],
        ['code', RUN_1, RUN_1, 'u1'],
      ])
    })

    it('falls back to implementation diffs for proxies without upgrade history', () => {
      const history = update('u1', RUN_1, T0, ADDRESS_A, [implementation])
      expect(changes(derive({ changes: history }))).toEqual([
        ['code', RUN_1, T0, 'u1'],
      ])
      const covered = derive({
        entries: [entry({ values: pastUpgrades([T0, TX_1]) })],
        changes: history,
      })
      expect(changes(covered)).toEqual([])
    })

    it('counts a state change on a field that is HIGH today, and nothing else', () => {
      const history = derive({
        changes: [
          ...update('u1', RUN_1, T0, ADDRESS_A, [owner]),
          ...update('u2', RUN_2, RUN_1, ADDRESS_A, [
            { kind: 'value', field: 'paused' },
            { kind: 'upgradeRecord', field: '$upgradeCount' },
            { kind: 'representationOnly', field: 'owner' },
            { kind: 'value' },
          ]),
        ],
        judgement: judgement({}, ['owner']),
      })
      expect(changes(history)).toEqual([['state', RUN_1, T0, 'u1']])
      expect(rows(history)).toEqual([['A', RUN_1, 0, 1]])
    })

    it('dates a state change at the upgrade bundled in the same diff', () => {
      const history = derive({
        entries: [entry({ values: pastUpgrades([T0, TX_1]) })],
        changes: update('u1', RUN_1, RUN_1 - 10 * DAY, ADDRESS_A, [
          appended(RUN_1 - 5 * DAY, TX_2),
          owner,
        ]),
        judgement: judgement({}, ['owner']),
      })
      expect(changes(history)).toEqual([
        ['code', RUN_1 - 5 * DAY, RUN_1 - 5 * DAY, 'u1'],
        ['state', RUN_1 - 5 * DAY, RUN_1 - 5 * DAY, 'u1'],
      ])
    })

    it('dates a state change at the upgrade that installed the new implementation', () => {
      const history = derive({
        entries: [
          entry({
            values: pastUpgrades(
              [T0, TX_1],
              [T0 + DAY, TX_3],
              [RUN_1 - 5 * DAY, TX_2],
            ),
          }),
        ],
        // a legacy entry: no previous run time, and the reshaped
        // $pastUpgrades shows an upgrade of long ago as appended
        changes: update('u1', RUN_1, undefined, ADDRESS_A, [
          implementation,
          appended(T0 + DAY, TX_3),
          owner,
        ]),
        judgement: judgement({}, ['owner']),
      })
      expect(changes(history)).toEqual([
        ['code', T0 + DAY, T0 + DAY, undefined],
        ['code', RUN_1 - 5 * DAY, RUN_1 - 5 * DAY, undefined],
        ['state', RUN_1 - 5 * DAY, RUN_1 - 5 * DAY, 'u1'],
      ])
    })

    it('keeps the history of a retired contract without giving it a row', () => {
      const history = derive({
        changes: [
          ...update('u1', RUN_1, T0, ADDRESS_B, [implementation]),
          ...update('u2', RUN_2, RUN_1, ADDRESS_B, [
            { status: 'deleted', template: 'x/B' },
          ]),
        ],
        judgement: judgement({ 'x/B': true }),
      })
      expect(rows(history)).toEqual([['A', T0, 0, 0]])
      expect(changes(history)).toEqual([['code', RUN_1, T0, 'u1']])
    })

    it('keeps the creation of a retired contract as a deployment', () => {
      const history = derive({
        changes: [
          ...update('u1', RUN_1, T0, ADDRESS_B, [
            { status: 'created', template: 'x/B' },
          ]),
          ...update('u2', RUN_2, RUN_1, ADDRESS_B, [
            { status: 'deleted', template: 'x/B' },
          ]),
        ],
        judgement: judgement({ 'x/B': true }),
      })
      expect(history?.deployments).toEqual([T0, RUN_1])
      expect(history?.observedSince).toEqual(T0)
    })

    it('takes the latest deletion time and any template a deletion carried', () => {
      const history = derive({
        changes: [
          ...update('u1', RUN_1, T0, ADDRESS_B, [
            { status: 'deleted', template: 'x/B' },
          ]),
          ...update('u2', RUN_2, RUN_1, ADDRESS_B, [{ status: 'deleted' }]),
          ...update('u3', RUN_2 + DAY, RUN_2, ADDRESS_B, [implementation]),
        ],
        judgement: judgement({ 'x/B': true }),
      })
      expect(rows(history)).toEqual([['A', T0, 0, 0]])
      expect(changes(history)).toEqual([])
    })

    it('ignores changes recorded after the contract left', () => {
      const history = derive({
        entries: [
          entry(),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            critical: { untilTimestamp: RUN_1 },
          }),
        ],
        changes: update('u1', RUN_2, RUN_1, ADDRESS_B, [implementation]),
      })
      expect(changes(history)).toEqual([])
    })

    it('skips updates the review marked as discovery bugs', () => {
      const history = derive({
        changes: update('u1', RUN_1, T0, ADDRESS_A, [implementation]),
        patch: patch({ ignoredUpdates: ['u1'] }),
      })
      expect(changes(history)).toEqual([])
    })
  })

  describe('whose change it is', () => {
    it('starts each clock at the project start or the join, ignoring earlier changes', () => {
      const history = derive({
        projectStart: RUN_1,
        entries: [
          entry(),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            name: 'B',
            critical: { sinceTimestamp: RUN_2 },
          }),
        ],
        changes: [
          ...update('u1', RUN_1 - DAY, T0, ADDRESS_A, [implementation]),
          ...update('u2', RUN_2 - DAY, RUN_1, ADDRESS_B, [implementation]),
        ],
      })
      expect(rows(history)).toEqual([
        ['A', RUN_1, 0, 0],
        ['B', RUN_2, 0, 0],
      ])
      expect(changes(history)).toEqual([])
      expect(history?.deployments).toEqual([T0, T0])
      expect(history?.observedSince).toEqual(RUN_1)
    })

    it('lets a reviewed change supersede its update for its contract', () => {
      const history = derive({
        entries: [
          entry(),
          entry({ address: ChainSpecificAddress(ADDRESS_B), name: 'B' }),
        ],
        changes: [
          ...update('u1', RUN_1, T0, ADDRESS_A, [owner]),
          ...update('u1', RUN_1, T0, ADDRESS_B, [owner]),
        ],
        judgement: judgement({}, ['owner']),
        patch: patch({
          events: [
            {
              timestamp: RUN_1 - 3 * DAY,
              type: 'state',
              contract: ADDRESS_A.toLowerCase(),
              updateId: 'u1',
              transaction: TX_3,
              reason: 'precise',
            },
          ],
        }),
      })
      expect(changes(history)).toEqual([
        ['state', RUN_1 - 3 * DAY, RUN_1 - 3 * DAY, 'u1'],
        ['state', RUN_1, T0, 'u1'],
      ])
      expect(rows(history)).toEqual([
        ['A', RUN_1 - 3 * DAY, 0, 1],
        ['B', RUN_1, 0, 1],
      ])
    })

    it('bounds a reviewed change by the project start and the critical window', () => {
      const history = derive({
        projectStart: RUN_1,
        entries: [
          entry(),
          entry({
            address: ChainSpecificAddress(ADDRESS_B),
            name: 'B',
            critical: { sinceTimestamp: RUN_2 },
          }),
        ],
        patch: patch({
          events: [
            {
              timestamp: RUN_1 - DAY,
              type: 'state',
              contract: ADDRESS_A.toLowerCase(),
              transaction: TX_3,
              reason: 'before the project',
            },
            {
              timestamp: RUN_2 - DAY,
              type: 'state',
              contract: ADDRESS_B.toLowerCase(),
              transaction: TX_3,
              reason: 'before it was critical',
            },
          ],
        }),
      })
      expect(changes(history)).toEqual([])
      expect(rows(history)).toEqual([
        ['A', RUN_1, 0, 0],
        ['B', RUN_2, 0, 0],
      ])
    })

    it('refuses a reviewed change on a contract outside the perimeter', () => {
      expect(() =>
        derive({
          patch: patch({
            events: [
              {
                timestamp: RUN_1,
                type: 'code',
                contract: ADDRESS_B,
                transaction: TX_3,
                reason: 'x',
              },
            ],
          }),
        }),
      ).toThrow('not in the perimeter')
    })

    it('refuses a reviewed change after the contract left', () => {
      expect(() =>
        derive({
          entries: [
            entry(),
            entry({
              address: ChainSpecificAddress(ADDRESS_B),
              critical: { untilTimestamp: RUN_1 },
            }),
          ],
          patch: patch({
            events: [
              {
                timestamp: RUN_1 + DAY,
                type: 'code',
                contract: ADDRESS_B,
                transaction: TX_3,
                reason: 'x',
              },
            ],
          }),
        }),
      ).toThrow('after it left the perimeter')
    })
  })
})
