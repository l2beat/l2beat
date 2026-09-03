import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { diffDiscovery, entriesForDiff } from './diffDiscovery'
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
