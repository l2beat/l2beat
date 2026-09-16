import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { diffDiscovery, entriesForDiffPair } from './diffDiscovery'
import type { DiscoveryOutput, EntryParameters } from './types'

const TIMELOCK = address('0x111')
const COUNCIL = address('0x222')

describe(entriesForDiffPair.name, () => {
  it('joins a holder that has an entry onto that entry', () => {
    const [, entries] = entriesForDiffPair(
      undefined,
      output([contract(TIMELOCK)], {
        [TIMELOCK]: { receivedPermissions: [perm(COUNCIL)] },
      }),
    )

    expect(entries.length).toStrictEqual(1)
    expect(entries.at(0)?.receivedPermissions).toStrictEqual([perm(COUNCIL)])
  })

  // Without a stand-in the holder is absent from both sides of every diff, so
  // a change to its permissions reaches neither diffHistory nor Update Monitor.
  it('stands in for a holder the project has no entry for', () => {
    const [, entries] = entriesForDiffPair(
      undefined,
      output([contract(TIMELOCK)], {
        [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
      }),
    )

    expect(entries.length).toStrictEqual(2)
    expect(entries.at(1)).toStrictEqual({
      type: 'Reference',
      address: COUNCIL,
      receivedPermissions: [perm(TIMELOCK)],
    })
  })

  // The first cross-project permission is the case the whole cluster modelling
  // exists to surface. Reported as a created entry it carries no field diffs,
  // and both the web feed and the ultimate-upgrader detection look for a
  // `receivedPermissions` field diff, so it would reach neither.
  it('reports a first external permission as a field change, not a creation', () => {
    const before = output([contract(TIMELOCK)], {})
    const after = output([contract(TIMELOCK)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })

    const diff = diffDiscovery(...entriesForDiffPair(before, after))

    expect(diff.length).toStrictEqual(1)
    expect(diff.at(0)?.address).toStrictEqual(COUNCIL)
    expect(diff.at(0)?.type).toStrictEqual(undefined)
    expect(diff.at(0)?.diff?.at(0)?.key).toStrictEqual('receivedPermissions')
  })

  it('reports a removed external permission the same way', () => {
    const before = output([contract(TIMELOCK)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })
    const after = output([contract(TIMELOCK)], {})

    const diff = diffDiscovery(...entriesForDiffPair(before, after))

    expect(diff.length).toStrictEqual(1)
    expect(diff.at(0)?.address).toStrictEqual(COUNCIL)
    expect(diff.at(0)?.type).toStrictEqual(undefined)
    // Rendered as `external contract`, so the reader can tell it apart from
    // something this project discovered itself.
    expect(diff.at(0)?.addressType).toStrictEqual('Reference')
  })

  it('says nothing when the external holder is unchanged', () => {
    const held = { [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] } }

    const diff = diffDiscovery(
      ...entriesForDiffPair(
        output([contract(TIMELOCK)], held),
        output([contract(TIMELOCK)], held),
      ),
    )

    expect(diff).toStrictEqual([])
  })

  // Standing in for it would compare a synthetic Reference against the real
  // entry, so a newly deployed contract would arrive as a Reference-to-contract
  // field modification and slip past the filter that keeps creations out of the
  // web feed.
  it('leaves a newly discovered contract a creation, permission or not', () => {
    const before = output([contract(TIMELOCK)], {})
    const after = output([contract(TIMELOCK), contract(COUNCIL)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })

    const diff = diffDiscovery(...entriesForDiffPair(before, after))

    expect(diff.length).toStrictEqual(1)
    expect(diff.at(0)?.address).toStrictEqual(COUNCIL)
    expect(diff.at(0)?.type).toStrictEqual('created')
    expect(diff.at(0)?.addressType).toStrictEqual('Contract')
  })

  it('leaves a removed contract a deletion, permission or not', () => {
    const before = output([contract(TIMELOCK), contract(COUNCIL)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })
    const after = output([contract(TIMELOCK)], {})

    const diff = diffDiscovery(...entriesForDiffPair(before, after))

    expect(diff.length).toStrictEqual(1)
    expect(diff.at(0)?.type).toStrictEqual('deleted')
  })

  it('never lists an address twice', () => {
    const [, entries] = entriesForDiffPair(
      undefined,
      output([contract(TIMELOCK), reference(COUNCIL)], {
        [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
      }),
    )

    expect(entries.map((e) => e.address)).toStrictEqual([TIMELOCK, COUNCIL])
  })

  for (const removed of [false, true]) {
    it(`keeps a permission change visible when its Reference is ${removed ? 'removed' : 'added'}`, () => {
      const without = output([contract(TIMELOCK)], {})
      const withReference = output([contract(TIMELOCK), reference(COUNCIL)], {
        [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
      })
      const [previous, current] = removed
        ? [withReference, without]
        : [without, withReference]

      const diff = diffDiscovery(...entriesForDiffPair(previous, current))

      expect(diff.length).toStrictEqual(1)
      expect(diff[0]?.type).toStrictEqual(undefined)
      expect(diff[0]?.diff?.map((field) => field.key) ?? []).toContain(
        'receivedPermissions',
      )
    })
  }

  it('does not mutate the discoveries being diffed', () => {
    const before = output([contract(TIMELOCK)], {})
    const after = output([contract(TIMELOCK), reference(COUNCIL)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })
    const original = structuredClone([before, after])

    diffDiscovery(...entriesForDiffPair(before, after))

    expect([before, after]).toStrictEqual(original)
  })
})

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function perm(from: ChainSpecificAddress) {
  return { permission: 'upgrade' as const, from }
}

function output(
  entries: EntryParameters[],
  permissions: DiscoveryOutput['permissions'],
): DiscoveryOutput {
  return {
    name: 'abstract',
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.random(),
    usedTemplates: {},
    modelledAgainst: {},
    usedBlockNumbers: {},
    permissions,
  }
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}

function reference(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Reference', address, targetProject: 'shared' }
}
