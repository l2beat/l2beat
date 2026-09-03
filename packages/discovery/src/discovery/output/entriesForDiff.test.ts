import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  diffDiscovery,
  entriesForDiff,
  entriesForDiffPair,
} from './diffDiscovery'
import type { DiscoveryOutput, EntryParameters } from './types'

const TIMELOCK = address('0x111')
const COUNCIL = address('0x222')

describe(entriesForDiff.name, () => {
  it('joins a holder that has an entry onto that entry', () => {
    const entries = entriesForDiff(
      output([contract(TIMELOCK)], {
        [TIMELOCK]: { receivedPermissions: [perm(COUNCIL)] },
      }),
    )

    expect(entries.length).toEqual(1)
    expect(entries.at(0)?.receivedPermissions).toEqual([perm(COUNCIL)])
  })

  // Without a stand-in the holder is absent from both sides of every diff, so
  // a change to its permissions reaches neither diffHistory nor Update Monitor.
  it('stands in for a holder the project has no entry for', () => {
    const entries = entriesForDiff(
      output([contract(TIMELOCK)], {
        [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
      }),
    )

    expect(entries.length).toEqual(2)
    expect(entries.at(1)).toEqual({
      type: 'Reference',
      address: COUNCIL,
      receivedPermissions: [perm(TIMELOCK)],
    })
  })

  it('surfaces a changed permission of an external holder', () => {
    const before = output([contract(TIMELOCK)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })
    const after = output([contract(TIMELOCK)], {})

    const diff = diffDiscovery(entriesForDiff(before), entriesForDiff(after))

    expect(diff.length).toEqual(1)
    expect(diff.at(0)?.address).toEqual(COUNCIL)
    expect(diff.at(0)?.addressType).toEqual('Reference')
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

    expect(diff.length).toEqual(1)
    expect(diff.at(0)?.address).toEqual(COUNCIL)
    expect(diff.at(0)?.type).toEqual(undefined)
    expect(diff.at(0)?.diff?.at(0)?.key).toEqual('receivedPermissions')
  })

  it('reports a removed external permission the same way', () => {
    const before = output([contract(TIMELOCK)], {
      [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
    })
    const after = output([contract(TIMELOCK)], {})

    const diff = diffDiscovery(...entriesForDiffPair(before, after))

    expect(diff.length).toEqual(1)
    expect(diff.at(0)?.type).toEqual(undefined)
  })

  it('says nothing when the external holder is unchanged', () => {
    const held = { [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] } }

    const diff = diffDiscovery(
      ...entriesForDiffPair(
        output([contract(TIMELOCK)], held),
        output([contract(TIMELOCK)], held),
      ),
    )

    expect(diff).toEqual([])
  })

  it('never lists an address twice', () => {
    const entries = entriesForDiff(
      output([contract(TIMELOCK), reference(COUNCIL)], {
        [COUNCIL]: { receivedPermissions: [perm(TIMELOCK)] },
      }),
    )

    expect(entries.map((e) => e.address)).toEqual([TIMELOCK, COUNCIL])
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
