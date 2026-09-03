import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
  entriesForDiffPair,
} from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'
import { UpdateDiffer } from './UpdateDiffer'

const GIVER = address('0x111')
const OTHER = address('0x333')
const HOLDER = address('0x222')

// Grading is driven by the real differ rather than hand-built field diffs,
// because the bugs in this area all come from how `lcsDiff` numbers its keys.
// A hand-built single field diff never shifts an index, so it cannot reach
// them: `sortReceivedPermissions` orders by JSON, "interact" sorts before
// "upgrade", and so adding or removing any non-upgrade permission renumbers
// every upgrade permission after it.
describe('UpdateDiffer upgrader grading', () => {
  const upgrade = (extra: object = {}) => ({
    permission: 'upgrade',
    from: GIVER,
    ...extra,
  })
  const interact = (extra: object = {}) => ({
    permission: 'interact',
    from: GIVER,
    ...extra,
  })

  const cases: [string, object[], object[], boolean][] = [
    ['first upgrade appears', [], [upgrade()], true],
    ['last upgrade removed', [upgrade()], [], true],
    [
      'upgrade removed, others remain',
      [interact(), upgrade()],
      [interact()],
      true,
    ],
    [
      'non-upgrade removed, upgrade untouched',
      [interact(), upgrade()],
      [upgrade()],
      false,
    ],
    ['upgrade replaced in place', [upgrade()], [interact()], true],
    [
      'non-upgrade removed AND the upgrade renumbered under it',
      [interact(), upgrade({ delay: 1 })],
      [upgrade({ delay: 2 })],
      true,
    ],
    [
      'non-upgrade added AND the upgrade renumbered under it',
      [upgrade({ via: [{ address: GIVER }] })],
      [interact(), upgrade({ via: [{ address: OTHER }] })],
      true,
    ],
    [
      'only a non-upgrade changed',
      [interact({ delay: 1 })],
      [interact({ delay: 2 })],
      false,
    ],
    ['nothing changed', [upgrade()], [upgrade()], false],
  ]

  for (const [label, before, after, expected] of cases) {
    it(label, () => {
      const differ = new UpdateDiffer(
        mockObject<ConfigReader>({
          readDiscovery: mockFn().returns({ entries: [] }),
        }),
        mockObject<Database>({}),
        mockObject<DiscoveryOutputCache>({}),
        Logger.SILENT,
      )
      const [previous, latest] = entriesForDiffPair(
        discovery(before),
        discovery(after),
      )

      const records = differ.getUpdateDiffs(
        diffDiscovery(previous, latest),
        previous,
        latest,
        'a-project',
        UnixTime.now(),
        1,
        2,
      )

      expect(records.some((r) => r.type === 'ultimateUpgraderChange')).toEqual(
        expected,
      )
    })
  }
})

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function discovery(permissions: object[]): DiscoveryOutput {
  return {
    name: 'a-project',
    timestamp: 0,
    entries: [{ type: 'Contract', address: GIVER }] as EntryParameters[],
    abis: {},
    configHash: Hash256.random(),
    usedTemplates: {},
    usedBlockNumbers: {},
    permissions:
      permissions.length === 0
        ? {}
        : { [HOLDER]: { receivedPermissions: permissions as never } },
  }
}
